import math
import times
import complex
import arraymancer
#nim c -r -d:blas=libopenblas -d:lapack=liblapack --verbosity:0 pdc.nim

type TFloat = float32

proc is_nan(v: TFloat): bool {.inline.} = v.classify == fcNan
proc nan_to_num(v: TFloat, alt: TFloat = 0.0): TFloat {.inline.} =
  if v.is_nan: alt else: v

proc eye[T: SomeNumber](m: int, k:T=1): Tensor[T] {.noInit.} =
  result = zeros[T](m, m)
  for i in 0 ..< m:
    result[i,i] = k

proc c_eye[T: SomeFloat](m: int, k:T=1): Tensor[Complex[T]] {.noInit.} =
  result = zeros[Complex[T]](m, m)
  for i in 0 ..< m:
    result[i, i] = complex(T(k))

proc zdiag*[T: SomeFloat](M: var Tensor[T], k: T=0.0) {.noInit.} =
  for i in 0..<M.shape[0]:
    M[i, i] = k

proc smooth_diag*[T: SomeFloat](M: var Tensor[T]): Tensor[T] =
  let
    k1 = M.max
    p = M.shape[0]
  result = zeros[T](p, p)
  #echo k1, ":", M[0, 0], ",", M[1, 1]
  for i in 0..<p:
    for j in 0..<p:
      if i != j:
        result[i, j] = M[i, j]
      else:
        result[i, j] = k1
  return M

proc matrix_spectrum*[T: SomeFloat](X: Tensor[Complex[T]], f: T = 0.1): Tensor[Complex[T]] =
  # f can be from 0 to 1 (fs)
  # TODO: Optimize
  let
    p = X.shape[0]
    m = X.shape[1]
    i0 = m mod p #if include_intercept: 1 else: 0
  var
    weights = zeros[Complex[T]](p, m - i0)
  result = zeros[Complex[T]](p, p)
  for k in 0..<int(m/p):
    weights[_.._, (k * p)..<((k + 1) * p)] = im(T(- PI) * f * T(k + 1))
  weights = weights.exp *. X[_.._, i0..<m]
  for k in 0..<p:
    #result[_.._, k] =  weights[_.._, k..<(m - i0)|p].sum(1)
    result[_.._, k] =  weights[_.._, k..<m|p].sum(1)
  
proc matrix_spectrum*[T: SomeFloat](X: Tensor[T], f: T = 0.1): Tensor[Complex[T]] =
  matrix_spectrum(X.astype(Complex[T]), f)

proc matrix_spectrum_range*[T: SomeFloat](X: Tensor[T], f0: T = 0, f1: T = 0.1, n_points: int = 100): Tensor[T] =
  let
    Y = X.astype(Complex[T])
    p = X.shape[0]
    df = T(f1 - f0) / T(n_points)
  var
    M = zeros[Complex[T]](p, p)
  for k in 0..<n_points:
    let f = df * T(k) + f0
    M +=  Y.matrix_spectrum(f=f)
  M = complex(T(df)) * (c_eye[T](p, T(n_points)) - M)
  for j in 0..<p:
    let
      a_j = M[_.._, j]
      k_j = sum(a_j.abs ^. 2)
    M[_.._, j] = M[_.._, j] /. complex(T(k_j.sqrt))
  result = M.abs.astype(T)
  #result.zdiag(result.mean)
  ####
  ####
  result = (result.abs +. T(1e-10)).log10

# G_PDC
# https://pdfs.semanticscholar.org/a159/916242afb8cbe8691f75a983388598af97e3.pdf
proc matrix_spectrum_range_gPDC*[T: SomeFloat](X: Tensor[T], f0: T = 0, f1: T = 0.1, n_points: int = 100): Tensor[T] =
  let
    Y = X.astype(Complex[T])
    p = X.shape[0]
    df = T(f1 - f0) / T(n_points)
  var
    M = zeros[Complex[T]](p, p)
    sd = X.std(axis=1).reshape(p)
  for k in 0..<n_points:
    let f = df * T(k) + f0
    M +=  Y.matrix_spectrum(f=f)
  M = complex(T(df)) * (c_eye[T](p, T(n_points)) - M)
  for j in 0..<p:
    #echo 1, " ", j, " ", M.shape
    let
      a_j = M[_.._, j]
      k_j = sum(a_j.abs ^. 2 *. sd)
    #echo k_j, " ", complex(T(sd[j] / k_j.sqrt))
    M[_.._, j] = M[_.._, j] * complex(T(nan_to_num(sd[j] / k_j.sqrt)))
  #echo M.abs
  result = M.abs.astype(T)
  result.zdiag(result.mean)


when isMainModule:
  var
    include_intercept = false
    X = zeros[Complex[TFloat]](4, 12)
    M = ones[Complex[TFloat]](4, 12+1)
    M1 = ones[TFloat](4, 12+1)
    p = X.shape[0]
    m = X.shape[1]
    i0 = if include_intercept: 1 else: 0
    #lags = zeros[Complex32](4, 12)

  echo X
  #X[_.._, (i0)..<m|p] = 1.complex32

  #X[_.._, (i0)..<(i0 + p)] = 1.complex32
  #X[_.._, (i0 + p)..<(i0 + 2 * p)] = 2.complex32
  #X[_.._, (i0 + 2 * p)..<(i0 + 3 * p)] = 3.complex32

  let
    f = 0.1
  for k in 0..<int((m - i0)/p):
    X[_.._, (i0 + k * p)..<(i0 + (k + 1) * p)] = complex[TFloat](0, -2 * PI * f * TFloat(k + 1))
  
  echo M1.astype(Complex32)
  echo X
  echo X.exp
  echo "<<<M"
  echo M.matrix_spectrum(include_intercept=true)
  echo "<<<M1"
  echo M1.matrix_spectrum(include_intercept=true)
  echo "<<<M"
  echo M1.matrix_spectrum_range(include_intercept=true)
  #echo X[1..<_|p, _.._]
  #echo X[_.._, 1..<m|p]

  echo X[_.._, (i0)..<m|p]
  echo X[_.._, (i0)..<m|p].sum(1)
  echo ""
  let xyz = X[_.._, (i0)..<m|p].sum(1)
  echo xyz.abs
  echo sum(xyz *. xyz)

  let
    a = @[1, 2, 3].toTensor()
    b = @[4, 5, 6].toTensor()

    c = @[complex(1.0, -2.0), complex(2.0, 3.0)].toTensor()
    d = @[complex(1.0, 2.0), complex(2.0, -3.0)].toTensor()

  echo a.dot(b)
  echo sum(c *. d)
  echo c.abs ^. 2
  echo sum(c.abs ^. 2)

