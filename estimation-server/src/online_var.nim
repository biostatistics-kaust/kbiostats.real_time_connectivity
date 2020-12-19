import math
import strutils
import strformat
import times
import arraymancer
import docopt
# nim c -r -d:release -d:danger -d:blas=libopenblas -d:lapack=liblapack --verbosity:0 -o:ovar online_var.nim

const PRINT_PROCESSING_TIME = false;

proc eye*[T: SomeNumber](m: int, k:T=1): Tensor[T] {.noInit.} =
  result = zeros[T](m, m)
  for i in 0 ..< m:
    result[i,i] = k

proc trace*[T: SomeNumber](X: Tensor[T]): T =
  assert X.shape.len == 2
  for i in 0 ..< X.shape[0]:
    for j in 0 ..< X.shape[1]:
      result += X[i, j]

proc diag*[T](d: Tensor[T], m, n: int): Tensor[T] {.noInit.}=
  # Creates a rectangular diagonal matrix
  assert d.rank == 1
  result = zeros[T](m, n)

  let k = min(m,n)
  assert d.size == k

  for i in 0 ..< k:
    result[i,i] = d[i]

proc onlineVAR*[T: SomeNumber](X: Tensor[T], 
                               beta: var Tensor[T], 
                               Sxx: var Tensor[T], 
                               Sxy: var Tensor[T], 
                               Omega: var Tensor[T], 
                               Sigma: var Tensor[T], 
                               lags: int=1, 
                               regularizer_factor: T=1e-5, 
                               learn_factor: T=1e-3,
                               svd_k_size: int = 2,
                               start_index: int = -1,
                               end_index: int = -1) =
    let
      p0 = X.shape[1]
      p = p0 * lags
      p_cte = p + 1
    when PRINT_PROCESSING_TIME:
      var
        t0 = epochTime()
    let
      idx0 = if start_index < 0: 0 else: start_index
      idx1 = if end_index < 0: X.shape[0] else: end_index
    if idx1 - lags < idx0: return

    for t in idx0 ..< (idx1 - lags):
    #for t in 0 ..< (X.shape[0] - lags):
        # x is organized like (x[t-3]... x[t-2]...x[t-1])
        #x = X[t: (t + lags)].reshape(1, -1)
        # now x is organized like (x[t-1]... x[t-2]...x[t-3])
        let
          #x = X[(t + lags-1)..t|-1, _.._].reshape(1, p)
          x = concat([[T(1.0)]].toTensor(), X[(t + lags-1)..t|-1, _.._].reshape(1, p), axis=1)
          y = X[t + lags, _].reshape(1, p0)
          x_x = x.transpose * x
        Sxx = (1 - learn_factor) * Sxx + learn_factor * x_x
        Sxy = (1 - learn_factor) * Sxy + learn_factor * x.transpose * y
        when false:
          let
            x_x_Omega = x_x * Omega
            g = trace(x_x_Omega) + regularizer_factor * trace(Omega)
            k = if g > 0: learn_factor / (1 - learn_factor + learn_factor * g) else: 0
          Omega = 1 / (1 - learn_factor) * Omega * (
              eye[T](p_cte) - k * (x_x_Omega - regularizer_factor * Omega)
          )
        when true:
          #let (U, S, Vh) = svd(Sxx + regularizer_factor * eye[T](p))
          let (U, S, Vh) = svd_randomized(Sxx + regularizer_factor * eye[T](p_cte), n_components=svd_k_size, n_oversamples=1, n_power_iters=1)
          Omega = Vh.transpose * diag(T(1.0) /. S, svd_k_size, svd_k_size) * U.transpose
          #echo "   ", Omega
          #echo "   ", trace(Omega * (Sxx + regularizer_factor * eye[T](p)))
          #echo "   ", trace(x_x * Omega), "  ", trace(Omega)
          #####stdout.write("*********")
        beta = Sxy.transpose * Omega

        let
          e = y - transpose(beta * (x.transpose))
        when PRINT_PROCESSING_TIME:
          if t mod 2000 == 0:
            stdout.write(t, " ", $Omega.max, "  ", $Sigma.max,
              "  ",
              round(epochTime() - t0, 2),
              "                 \r")
            t0 = epochTime()
        Sigma = learn_factor * e.transpose*(e) + (1 - learn_factor) * Sigma

type BasicVAR[T: SomeNumber] = object
  beta*: Tensor[T]
  Sxx*: Tensor[T]
  Sxy*: Tensor[T]
  Omega*: Tensor[T]
  Sigma*: Tensor[T]

proc save_as_npy*[T: SomeNumber](var_result: BasicVAR[T], output_template: string, verbose: bool = true, save_sums: bool = false) =
  let
    output_beta = output_template.replace("$", "beta")
    output_omega = output_template.replace("$", "omega")
    output_sigma = output_template.replace("$", "sigma")
  if verbose:
    echo "File output:"
    echo ":: output-beta: ", output_beta
  write_npy(var_result.beta, output_beta)
  if verbose:
    echo ":: output-omega: ", output_omega
  write_npy(var_result.Omega, output_omega)
  if verbose:
    echo ":: output-sigma: ", output_sigma
  write_npy(var_result.Sigma, output_sigma)
  if save_sums:
    let
      output_Sxx = output_template.replace("$", "Sxx")
      output_Sxy = output_template.replace("$", "Sxy")
    if verbose:
      echo ":: output-Sxx: ", output_Sxx
    write_npy(var_result.Sxx, output_Sxx)
    if verbose:
      echo ":: output-Sxy: ", output_Sxy
    write_npy(var_result.Sxy, output_Sxy)

proc onlineVAR*[T: SomeNumber](X: Tensor[T], 
                               lags: int=1, 
                               regularizer_factor: T=1e-5, 
                               learn_factor: T=1e-3,
                               svd_k_size: int = 2,
                               start_index: int = -1,
                               end_index: int = -1): BasicVAR[T] =
  let
    p = X.shape[1]
  result.beta = zeros[T](p, 1 + p * lags)
  result.Sxx = eye[T](1 + p * lags)
  result.Sxy = zeros[T](1 + p * lags, p)
  result.Omega = eye[T](1 + p * lags)
  result.Sigma = zeros[T](p, p)
  X.onlineVAR(result.beta, result.Sxx, result.Sxy, result.Omega, result.Sigma, lags=lags, regularizer_factor=regularizer_factor, learn_factor=learn_factor, svd_k_size=svd_k_size, start_index=start_index, end_index=end_index)

#ovar-server [--input=<IN>] [--output=<OUT>] [--lags=<LAGS>] [--regularizer-factor=<RFACTOR>] [--learn-factor=<LFACTOR>] [--svd-size=<SVDSIZE>]
when isMainModule:
  let doc = """
  Online Vector-Autoregressive Estimator.

  Usage:
    ovar-server [options]
    ovar-server --help
    ovar-server --version

  Options:
    -h --help                                   Show this screen.
    -v --version                                Show version.
    --input=IN, -i IN                           Input numpy file name [default: sample.npy]
    --output=OUT, -o OUT                        Output numpy file name template, $ will be replaced by the coeff. name [default: out-$.npy].
    --input-scale=AMP, -k AMP                   Input scale [default: 1.0]
    --lags=LAGS, -p LAGS                        Order of the VAR model [default: 2].
    --regularizer-factor=RFACTOR, -r RFACTOR    Regularizer factor [default: 1e-5].
    --learn-factor=LFACTOR, -l LFACTOR          Learn factor [default: 1e-3].
    --svd-size=SVDSIZE, -s SVDSIZE              SVD size [default: 2].
    --verbose, -t                               Verbose data: parameters, file outputs and processing time

    --start-index=ISTART                        Start time-index [default: 0]
    --end-index=IEND                            End time-index [default: -1]

    --save-sums                                 Save partial sums
    --input-sums=SIN                            Partial sums file name template, $ will be replaced by the coeff. name [default: ].
  
  Example:
    ovar -p 10 -l 0.1 -r 0.01 -s 1 -o a.np -i b.np
  """
  type TFloat = float32
  let
    args = docopt(doc, version = "Online Vector-Autoregressive Estimator v2.0 (2020)")
    verbose = parseBool($args["--verbose"])
    svd_size = parseInt($args["--svd-size"])
    learn_factor = TFloat(parseFloat($args["--learn-factor"]))
    regularizer_factor = TFloat(parseFloat($args["--regularizer-factor"]))
    lags = parseInt($args["--lags"])
    input_scale = TFloat(parseFloat($args["--input-scale"]))
    output = ($args["--output"])
    input = ($args["--input"])
    start_index = parseInt($args["--start-index"])
    end_index = parseInt($args["--end-index"])
    save_sums = parseBool($args["--save-sums"])
    input_sums = ($args["--input-sums"])
  if verbose:
    echo "Parameters:"
    echo ":: verbose: ", verbose
    echo ":: svd-size: ", svd_size
    echo ":: learn-factor: ", learn_factor
    echo ":: regularizer-factor: ", regularizer_factor
    echo ":: lags: ", lags
    echo ":: input-scale: ", input_scale
    echo ":: output-template: ", output
    echo ":: input: ", input
    echo ":: start-index: ", start_index
    echo ":: end-index: ", end_index
    echo ":: save-sums: ", save_sums
    echo ":: input-sums: ", input_sums
  var
    t0 = epochTime()
    t_read = epochTime()
    t_ovar = epochTime()
    t_ovar_total = epochTime()
  #
  t0 = epochTime()
  let
    X = read_npy[TFloat](input) * input_scale
    p = X.shape[1]
    i0 = start_index
    i1 = if end_index > 0 and end_index > start_index: end_index else: X.shape[0]
    processed = (i1 - lags - i0 + 1)
  #let
  #  X = Y[i0..i1]
  t_read = 1000.0 * (epochTime() - t0)
  if verbose:
    echo &":: data-shape: {X.shape[0]} x {X.shape[1]}"
    echo &":: processed-data-shape: {processed} x {X.shape[1]}"
  #
  var
    estimation: BasicVAR[TFloat]
  estimation.beta = zeros[TFloat](p, 1 + p * lags)
  estimation.Sxx = eye[TFloat](1 + p * lags)
  estimation.Sxy = zeros[TFloat](1 + p * lags, p)
  estimation.Omega = eye[TFloat](1 + p * lags)
  estimation.Sigma = zeros[TFloat](p, p)
  if input_sums.strip.len > 0:
    let
      input_Sxx = input_sums.replace("$", "Sxx")
      input_Sxy = input_sums.replace("$", "Sxy")
    estimation.Sxx = read_npy[TFloat](input_Sxx)
    estimation.Sxy = read_npy[TFloat](input_Sxy)
  #
  t0 = epochTime()
  X.onlineVAR(estimation.beta,
    estimation.Sxx,
    estimation.Sxy,
    estimation.Omega,
    estimation.Sigma,
    lags=lags,
    regularizer_factor=regularizer_factor, 
    learn_factor=learn_factor, 
    svd_k_size=svd_size, 
    start_index=start_index, end_index=end_index)
  t_ovar_total = 1000.0 * (epochTime() - t0)
  t_ovar = 1000.0 * (epochTime() - t0) / TFloat(processed)
  #
  #resultVAR.save_as_npy(output, verbose=verbose)
  estimation.save_as_npy(output, verbose=verbose, save_sums=save_sums)
  if verbose:
    echo "Processing time:"
    echo &":: reading dataset [ms]: {t_read:5.3f}"
    echo &":: processing online VAR/timetick [ms]: {t_ovar:.4g}"
    echo &":: processing online VAR [ms]: {t_ovar_total:5.3f}"

#[

nim c -r -d:release -d:danger -d:blas=libopenblas -d:lapack=liblapack --verbosity:0 -o:ovar core.nim -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 1 -t

nim c -r -d:release -d:danger -d:blas=libopenblas -d:lapack=liblapack --verbosity:0 -o:ovar core.nim -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 1 -t --index-start=0 --index-end=5000

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 1 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 1.02e+03
:: processing online VAR [ms]: 0.878

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 2 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 981.
:: processing online VAR [ms]: 0.833

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 4 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 999.
:: processing online VAR [ms]: 1.42

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 8 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 996.
:: processing online VAR [ms]: 0.823

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 16 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 992.
:: processing online VAR [ms]: 1.35

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 32 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 1.01e+03
:: processing online VAR [ms]: 0.866

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 64 -t --index-start=0 --index-end=5000
Processing time:
:: reading dataset [ms]: 986.
:: processing online VAR [ms]: 1.38

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 128 -t --index-start=0 --index-end=5000
ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 256 -t --index-start=0 --index-end=5000
ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 512 -t --index-start=0 --index-end=5000


ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 4 -t

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 8 -t

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 12 -t

ovar -o out-$.npy -i Nathan-example.npy -k 1e-4 -p 32 -t


]#

when false:
  let
    #d = read_npy[TFloat]("VAR2-sample.npy")
    d = read_npy[TFloat]("Nathan-example.npy") * 1e-4

  let
    p = d.shape[1]
    lags = 4
    #N = d.shape[0]
    regularizer_factor = 1e-2
  var
    beta = zeros[TFloat](p, 1 + p * lags)
    Sxx = eye[TFloat](1 + p * lags)
    Sxy = zeros[TFloat](1 + p * lags, p)
    Omega = eye[TFloat](1 + p * lags)
    Sigma = zeros[TFloat](p, p)
  echo d.shape
  d.online_estimation_lagged(beta, Sxx, Sxy, Omega, Sigma, lag=lags, regularizer_factor=regularizer_factor)
  #echo beta
  echo "Finished"
  write_npy(beta, "results-beta.npy")
  write_npy(Sigma, "results-Sigma.npy")


#[ 

Speed/timepoint = 15ns * (#channels * #lags) ^ 2
Speed/timepoint ~ O((#channels * #lags) ^ 2)

VAR(1) 64x1: 26.11 secs: 12823.9 timepoints/sec
        Command being timed: "./core"
        User time (seconds): 0.00
        System time (seconds): 0.03
        Percent of CPU this job got: 0%
        Elapsed (wall clock) time (h:mm:ss or m:ss): 21:44.03
        Average shared text size (kbytes): 0
        Average unshared data size (kbytes): 0
        Average stack size (kbytes): 0
        Average total size (kbytes): 0
        Maximum resident set size (kbytes): 5240
        Average resident set size (kbytes): 0
        Major (requiring I/O) page faults: 1681
        Minor (reclaiming a frame) page faults: 0
        Voluntary context switches: 0
        Involuntary context switches: 0
        Swaps: 0
        File system inputs: 0
        File system outputs: 0
        Socket messages sent: 0
        Socket messages received: 0
        Signals delivered: 0
        Page size (bytes): 65536
        Exit status: 0
        
VAR(2) 64x2: 84.91 secs: 3943.4 timepoints/sec
        Command being timed: "./core"
        User time (seconds): 0.00
        System time (seconds): 0.03
        Percent of CPU this job got: 0%
        Elapsed (wall clock) time (h:mm:ss or m:ss): 21:44.03
        Average shared text size (kbytes): 0
        Average unshared data size (kbytes): 0
        Average stack size (kbytes): 0
        Average total size (kbytes): 0
        Maximum resident set size (kbytes): 5240
        Average resident set size (kbytes): 0
        Major (requiring I/O) page faults: 1681
        Minor (reclaiming a frame) page faults: 0
        Voluntary context switches: 0
        Involuntary context switches: 0
        Swaps: 0
        File system inputs: 0
        File system outputs: 0
        Socket messages sent: 0
        Socket messages received: 0
        Signals delivered: 0
        Page size (bytes): 65536
        Exit status: 0
    
VAR(4) 64x4: 278.37 secs: 1202.8 timepoints/sec
        Command being timed: "./core"
        User time (seconds): 0.00
        System time (seconds): 0.01
        Percent of CPU this job got: 0%
        Elapsed (wall clock) time (h:mm:ss or m:ss): 4:38.37
        Average shared text size (kbytes): 0
        Average unshared data size (kbytes): 0
        Average stack size (kbytes): 0
        Average total size (kbytes): 0
        Maximum resident set size (kbytes): 5700
        Average resident set size (kbytes): 0
        Major (requiring I/O) page faults: 1543
        Minor (reclaiming a frame) page faults: 0
        Voluntary context switches: 0
        Involuntary context switches: 0
        Swaps: 0
        File system inputs: 0
        File system outputs: 0
        Socket messages sent: 0
        Socket messages received: 0
        Signals delivered: 0
        Page size (bytes): 65536
        Exit status: 0

VAR(10) 64x10: 1304.03 secs: 256.8 op/sec
        Command being timed: "./core"
        User time (seconds): 0.00
        System time (seconds): 0.03
        Percent of CPU this job got: 0%
        Elapsed (wall clock) time (h:mm:ss or m:ss): 21:44.03
        Average shared text size (kbytes): 0
        Average unshared data size (kbytes): 0
        Average stack size (kbytes): 0
        Average total size (kbytes): 0
        Maximum resident set size (kbytes): 5240
        Average resident set size (kbytes): 0
        Major (requiring I/O) page faults: 1681
        Minor (reclaiming a frame) page faults: 0
        Voluntary context switches: 0
        Involuntary context switches: 0
        Swaps: 0
        File system inputs: 0
        File system outputs: 0
        Socket messages sent: 0
        Socket messages received: 0
        Signals delivered: 0
        Page size (bytes): 65536
        Exit status: 0
 ]#