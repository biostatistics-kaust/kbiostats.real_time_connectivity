# nim c -r -d:blas=libopenblas -d:lapack=liblapack  ovarserver.nim -o ovar-server
# nim c -r -d:release -d:danger -d:blas=libopenblas -d:lapack=liblapack  ovarserver.nim -o ovar-server

# nim c -r -d:blas=libopenblas -d:lapack=liblapack -o:ovar-server  ovarserver.nim -p 9120
# nim c -r -d:release -d:danger -d:blas=libopenblas -d:lapack=liblapack -o:ovar-server  ovarserver.nim -p 9120
import math
import algorithm
import sequtils
import strutils
import docopt
import websocket
import asynchttpserver
import asyncnet
import asyncdispatch
import json
import arraymancer
import online_var
import pdc

let doc = """
Online Vector-Autoregressive Estimator.

Usage:
  ovar-server --port=<PORT>
  ovar-server --help
  ovar-server --version

Options:
  -h --help               Show this screen.
  -v --version               Show version.
  -p PORT --port=<PORT>   Connection port. It should be available in the system
"""


let
  args = docopt(doc, version = "Online Vector-Autoregressive Estimator v2.0 (2020)")
  port = parseInt($args["--port"])
  server = newAsyncHttpServer()

type TFloat = float32
type BatchData = object
  general: int
  timeseries: int
  pdc: int
  pdc_split: int
  connectivity: int
  link_arrows: int

proc init_batch_data(v: int = 1): BatchData = 
  result.general = v
  result.timeseries = v
  result.pdc = v
  result.pdc_split = v
  result.connectivity = v
  result.link_arrows = v

proc mod_increment(a: var BatchData, b: BatchData) =
  a.general = (a.general + 1) mod b.general
  a.timeseries = (a.timeseries + 1) mod b.timeseries
  a.pdc = (a.pdc + 1) mod b.pdc
  a.pdc_split = (a.pdc_split + 1) mod b.pdc_split
  a.connectivity = (a.connectivity + 1) mod b.connectivity
  a.link_arrows = (a.link_arrows + 1) mod b.link_arrows

type EstimatorConfiguration = object
  numpy_file: string
  lags: int
  batch: BatchData
  regularizer_factor: float
  amplitude_factor: float
  representative_values_number: int
  sampling_frequency: float
  pdc_number_evaluation_points: int

proc init_estimator_configuration(): EstimatorConfiguration =
  result.numpy_file = ""
  result.lags = 1
  #
  result.batch = init_batch_data()
  #
  result.regularizer_factor = 1e-2
  result.amplitude_factor = 1.0
  result.representative_values_number = 10
  result.sampling_frequency = 200
  result.pdc_number_evaluation_points = 50


type TRepresentativeValue = tuple
  i: int
  j: int
  lag: int
  val: TFloat

proc cmp_abs(x: TRepresentativeValue, y: TRepresentativeValue): int =
  int(x.val.abs - y.val.abs)

proc cmp(x: TRepresentativeValue, y: TRepresentativeValue): int =
  int(x.val - y.val)

import strformat
proc is_nan(v: TFloat): bool {.inline.} = v.classify == fcNan
proc nan_to_num(v: TFloat, alt: TFloat = 0.0): TFloat {.inline.} =
  if v.is_nan: alt else: v

proc toList(Sigma: Tensor[TFloat]): seq[TRepresentativeValue] = 
  let
    p = Sigma.shape[0]
    L = Sigma.shape[1]
    j0 = L mod p # start at 1 if intercept
    mean_sigma = Sigma.mean
  for i in 0..<p:
    for j in j0..<L:
      result.add((i, (j - j0) mod p, int(j / p), Sigma[i, j].nan_to_num(mean_sigma)))

proc as_json(lst: seq[TRepresentativeValue]): string = 
  result = "["
  for p in 0..lst.high:
    result.add &"[{lst[p][0]}, {lst[p][1]}, {lst[p][2]}, {lst[p][3]:.4e}]"
    if p != lst.high:
      result.add ", "
  result.add "]"

proc as_json(lst: seq[string]): string = 
  result = "["
  for p in 0..lst.high:
    result.add &"\"{lst[p]}\""
    if p != lst.high:
      result.add ", "
  result.add "]"

proc as_json(lst: seq[TFloat]): string = 
  result = "["
  for p in 0..lst.high:
    result.add &"{lst[p]:.4e}"
    if p != lst.high:
      result.add ", "
  result.add "]"

proc representative_values(Sigma: Tensor[TFloat], best_elements: int=10): seq[TRepresentativeValue] = 
  result = sorted(Sigma[_.._,1..<Sigma.shape[1]].toList, cmp_abs, SortOrder.Descending)[0..best_elements]

proc max_values(Sigma: Tensor[TFloat]): seq[TRepresentativeValue] = 
  let
    maxval = Sigma.max()
    p = Sigma.shape[0]
    L = Sigma.shape[1]
    j0 = L mod p # start at 1 if intercept
    lags = int((L - 1) / p)
  var
    resultMatrix = zeros[TFloat](p, p)
  for i in 0 .. (p-1):
    for j in 0 .. (p-1):
      resultMatrix[i, j] = Sigma[i, (j0 + j)..<L|p].max()
  ###return resultMatrix.toList
  return resultMatrix.smooth_diag.toList

proc argmax_values(Sigma: Tensor[TFloat]): seq[TRepresentativeValue] = 
  let
    maxval = Sigma.max()
    p = Sigma.shape[0]
    L = Sigma.shape[1]
    j0 = L mod p # start at 1 if intercept
    lags = int((L - 1) / p)
  var
    resultMatrix = zeros[TFloat](p, p)
  for i in 0 .. (p-1):
    for j in 0 .. (p-1):
      resultMatrix[i, j] = Sigma[i, (j0 + j)..<L|p].reshape(lags, 1).argmax(0)[0, 0].float
  ###return resultMatrix.toList
  return resultMatrix.smooth_diag.toList

proc matrix_spectrum_total(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  var
    Y = matrix_spectrum_range[TFloat](X, f0=0.0, f1=50.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc matrix_spectrum_delta(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  #echo matrix_spectrum_range(X, f0=0.0/fs, f1=4.0/fs, n_points=n_points, include_intercept=include_intercept)
  #echo matrix_spectrum_range(X, f0=0.0/fs, f1=4.0/fs, n_points=n_points).toList
  
  var
    Y = matrix_spectrum_range(X, f0=0.01/fs, f1=4.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc matrix_spectrum_theta(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  
  var
    Y = matrix_spectrum_range(X, f0=4.0/fs, f1=8.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc matrix_spectrum_alpha(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  
  var
    Y = matrix_spectrum_range(X, f0=8.0/fs, f1=12.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc matrix_spectrum_beta(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  
  var
    Y = matrix_spectrum_range(X, f0=12.0/fs, f1=30.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc matrix_spectrum_gamma(X: Tensor[TFloat], config: EstimatorConfiguration): seq[TRepresentativeValue] =
  let
    fs = TFloat(config.sampling_frequency)
    n_points = config.pdc_number_evaluation_points
  
  var
    Y = matrix_spectrum_range(X, f0=30.0/fs, f1=50.0/fs, n_points=n_points)
  return Y.smooth_diag.toList

proc pdc_representative_values(Sigma: Tensor[TFloat], config: EstimatorConfiguration, best_elements: int=10): seq[TRepresentativeValue] = 
  return sorted(Sigma.matrix_spectrum_total(config), cmp[TRepresentativeValue], SortOrder.Descending)[0..best_elements]

import times
iterator start_processing(config: var EstimatorConfiguration): string = 
  echo ":: READING"  
  ###config.numpy_file = "Nathan-example.npy"
  let
    X = read_npy[TFloat](config.numpy_file) * config.amplitude_factor
    p = X.shape[1]
    lags = config.lags
    regularizer_factor = config.regularizer_factor
    representative_values_number = config.representative_values_number
    channels = readLines(config.numpy_file & ".labels", p)
  var
    beta = zeros[TFloat](p, 1 + p * lags)
    Sxx = eye[TFloat](1 + p * lags)
    Sxy = zeros[TFloat](1 + p * lags, p)
    Omega = eye[TFloat](1 + p * lags)
    Sigma = zeros[TFloat](p, p)
  #for t in (lags + 1) ..< X.shape[0]) | config.batch:
  yield (&"{{\"type\": \"channels\", \"value\": {channels.as_json}}}")
  
  #echo ":: WARMING UP"  
  #for i in 1..5:
  #  for t in (lags + 1)..min(100, X.shape[0]):
  #    X[(t - lags)..t].online_estimation_lagged(beta, Sxx, Sxy, Omega, Sigma, lag=lags, regularizer_factor=regularizer_factor)
  
  echo ":: STARTING"
  var k = init_batch_data(-1)
  for t in (lags + 1)..X.shape[0]:
    X[(t - lags)..t].onlineVAR(beta, Sxx, Sxy, Omega, Sigma, lags=lags, regularizer_factor=regularizer_factor)
    #k = (k + 1) mod config.batch
    k.mod_increment(config.batch)
    if k.timeseries == 0:
      let timepoint = (1..p).mapIt(TFloat(X[t, it - 1]))
      yield (&"{{\"type\": \"timepoints\", \"value\": {timepoint.as_json}}}")
    if k.connectivity == 0:
      yield (&"{{\"type\": \"maximum-values\", \"value\": {beta.max_values.as_json}}}")
      yield (&"{{\"type\": \"maximum-lags\", \"value\": {beta.argmax_values.as_json}}}")
    if k.link_arrows == 0:
      yield (&"{{\"type\": \"relevant-links\", \"value\": {beta.representative_values(representative_values_number).as_json}}}")
      yield (&"{{\"type\": \"pdc-relevant-links\", \"value\": {beta.pdc_representative_values(config, representative_values_number).as_json}}}")
    if k.pdc == 0:
      let t0 = epochTime()
      yield (&"{{\"type\": \"pdc-total\", \"value\": {beta.matrix_spectrum_total(config).as_json}}}")
      stdout.write(&" PDC-general Processing time ({beta.shape}): {(epochTime() - t0)*100:.3f}ms                 \r")
    if k.pdc_split == 0:
      let t0 = epochTime()
      yield (&"{{\"type\": \"pdc-delta\", \"value\": {beta.matrix_spectrum_delta(config).as_json}}}")
      yield (&"{{\"type\": \"pdc-theta\", \"value\": {beta.matrix_spectrum_theta(config).as_json}}}")
      yield (&"{{\"type\": \"pdc-alpha\", \"value\": {beta.matrix_spectrum_alpha(config).as_json}}}")
      yield (&"{{\"type\": \"pdc-beta\", \"value\": {beta.matrix_spectrum_beta(config).as_json}}}")
      yield (&"{{\"type\": \"pdc-gamma\", \"value\": {beta.matrix_spectrum_gamma(config).as_json}}}")
      stdout.write(&" PDC-region Processing time ({beta.shape}): {(epochTime() - t0)*100:.3f}ms                 \r")


proc update_config(config: var EstimatorConfiguration, jsonData: JsonNode, ws: AsyncWebSocket): string = 
  result = ""
  let command = jsonData{"command"}.getStr("none")
  if command == "none" or command == "stop" or command == "pause" or command == "continue":
    return
  elif command == "regularizer-factor":
    config.regularizer_factor = jsonData{"value"}.getFloat(1e-2)
  elif command == "amplitude-factor":
    config.amplitude_factor = jsonData{"value"}.getFloat(1e-2)
  elif command == "numpy-file":
    config.numpy_file = jsonData{"value"}.getStr()
  elif command == "lags":
    config.lags = jsonData{"value"}.getInt()
  elif command == "max-representative-values":
    config.representative_values_number = jsonData{"value"}.getInt(10)
  elif command == "sampling-frequency":
    config.sampling_frequency = jsonData{"value"}.getFloat()
  elif command == "pdc-number-evaluation-points":
    config.pdc_number_evaluation_points = jsonData{"value"}.getInt()
  elif command == "batch":
    config.batch.general = jsonData{"value"}.getInt()
  elif command == "batch-general-pdc":
    config.batch.pdc = jsonData{"value"}.getInt()
  elif command == "batch-region-pdc":
    config.batch.pdc_split = jsonData{"value"}.getInt()
  elif command == "batch-connectivity":
    config.batch.connectivity = jsonData{"value"}.getInt()
  elif command == "batch-link-arrows":
    config.batch.link_arrows = jsonData{"value"}.getInt()
  elif command == "batch-timeseries":
    config.batch.timeseries = jsonData{"value"}.getInt()
  echo "Key:", command
  echo "Value:", config
  result = command
  #if command == "start":
  #  config.start_processing(ws)

proc get_command(st_instruction: tuple[opcode: Opcode, data: string]): string =
  result = ""
  if st_instruction.opcode == Opcode.Text:
    let st_instruction_json = parseJson($st_instruction.data)
    return st_instruction_json{"command"}.getStr("")

proc get_command(st_instruction: Future[tuple[opcode: Opcode, data: string]]): string =
  if st_instruction.finished:
    return st_instruction.read.get_command

#
#
#

const NUMBER_PACKETS_PER_TICK = 10

proc request_server(req: Request) {.async, gcsafe.} =
  let (ws, error) = await verifyWebsocketRequest(req, "ovar-protocol")

  if ws.isNil:
    echo "WS negotiation failed: ", error
    await req.respond(Http400, "Websocket negotiation failed: " & error)
    req.client.close()
    return

  var config = init_estimator_configuration()
  echo "New websocket customer arrived!"
  while true:
    let (opcode, data) = await ws.readData()
    try:
      case opcode
      of Opcode.Text:
        let special_command = config.update_config(parseJson($data), ws)
        if special_command == "start":
          for str_result in start_processing(config):
            waitFor ws.sendText(str_result)
            let st_instruction = ws.readData()
            await st_instruction or sleepAsync(3)
            if st_instruction.get_command == "stop":
              echo ":: STOP!"
              break
            elif st_instruction.get_command == "close":
              echo ":: CLOSE!"
              asyncCheck ws.close()
              break
            elif st_instruction.get_command == "pause":
              echo ":: PAUSE!"
              var new_instruction = await ws.readData()
              while new_instruction.get_command != "continue":
                new_instruction = await ws.readData()
        elif special_command == "close":
          echo ":: CLOSE BY CMD!"
          asyncCheck ws.close()
      of Opcode.Binary:
        waitFor ws.sendBinary(data)
      of Opcode.Close:
        asyncCheck ws.close()
        let (closeCode, reason) = extractCloseData(data)
        echo "Webocket went away, close code: ", closeCode, ", reason: ", reason
        break
      else: discard
    except:
      echo "Encountered exception: ", getCurrentExceptionMsg()

waitFor server.serve(Port(port), request_server)

