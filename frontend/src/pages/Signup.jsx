import { useState, useEffect,useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router';
import { registerUser } from '../authSlice';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import toast from 'react-hot-toast';

const signupSchema = z.object({
  firstName: z.string().min(3, "Minimum character should be 3"),
  emailId: z.string().email("Invalid Email"),
  password: z.string().min(8, "Password is too weak")
});

function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = (data) => {
    dispatch(registerUser(data));
    if(isAuthenticated){
      toast.success("Logged In Successfully!")
    }
  };


  const titleanime = useRef()

  useGSAP(() => {
    gsap.from(titleanime.current, {
      y: -50,
      opacity: 0,
      duration: 1
    })
  })

  const formanime = useRef()
  useGSAP(() => {
    gsap.from(formanime.current, {
      y: 50,
      opacity: 0,
      duration: 2
    })
  })



  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[radial-gradient(125%_125%_at_50%_10%,#000000_40%,#010133_100%)]">
      {/* Animated background shapes */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-slate-700/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gray-600/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-slate-600/10 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <h1 ref={titleanime} className="text-2xl md:text-3xl lg:text-4xl font-bold mb-8 text-center pb-10 text-gray-200 drop-shadow-lg relative z-10">
        Start Your Coding Journey with Codezy!
      </h1>

      {/* Glassmorphism Card */}
      <div ref={formanime} className="relative z-10 w-[90%] max-w-md sm:max-w-lg md:w-96">
        <div className="backdrop-blur-xl bg-gray-900/40 border border-gray-600/30 rounded-3xl shadow-2xl p-8 relative overflow-hidden">
          {/* Glass shine effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-700/10 via-transparent to-transparent rounded-3xl"></div>

          {/* Content */}
          <div className="relative z-10">
            <h2 className="text-3xl font-bold text-center mb-8 text-gray-100 drop-shadow-md">Codezy</h2>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text text-gray-300 font-medium">First Name</span>
                </label>
                <input
                  type="text"
                  placeholder="John"
                  className={`input w-full backdrop-blur-md bg-gray-800/30 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/50 focus:border-gray-500/60 transition-all duration-300 ${errors.firstName ? 'border-red-400' : ''}`}
                  {...register('firstName')}
                />
                {errors.firstName && (
                  <span className="text-red-400 text-sm mt-2 drop-shadow-sm">{errors.firstName.message}</span>
                )}
              </div>

              {/* Email Field */}
              <div className="form-control mb-6">
                <label className="label">
                  <span className="label-text text-gray-300 font-medium">Email</span>
                </label>
                <input
                  type="email"
                  placeholder="john@example.com"
                  className={`input w-full backdrop-blur-md bg-gray-800/30 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/50 focus:border-gray-500/60 transition-all duration-300 ${errors.emailId ? 'border-red-400' : ''}`}
                  {...register('emailId')}
                />
                {errors.emailId && (
                  <span className="text-red-400 text-sm mt-2 drop-shadow-sm">{errors.emailId.message}</span>
                )}
              </div>

              {/* Password Field with Toggle */}
              <div className="form-control mb-8">
                <label className="label">
                  <span className="label-text text-gray-300 font-medium">Password</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className={`input w-full pr-12 backdrop-blur-md bg-gray-800/30 border border-gray-600/40 text-gray-100 placeholder-gray-400 focus:bg-gray-800/50 focus:border-gray-500/60 transition-all duration-300 ${errors.password ? 'border-red-400' : ''}`}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors duration-200 p-1"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
                  <span className="text-red-400 text-sm mt-2 drop-shadow-sm">8+ characters with uppercase, lowercase, number & symbol</span>
              </div>

              {/* Submit Button */}
              <div className="form-control mb-6 flex justify-center">
                <button
                  type="submit"
                  className={`btn w-full backdrop-blur-md bg-white/20 border border-white/30 text-white font-semibold hover:bg-white/30 hover:border-white/50 transition-all duration-300 shadow-lg ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Signing Up...
                    </div>
                  ) : (
                    'Sign Up'
                  )}
                </button>
              </div>
            </form>

            {/* Login Redirect */}
            <div className="text-center">
              <span className="text-white/80 text-sm">
                Already have an account?{' '}
                <NavLink to="/login" className="text-white font-semibold hover:text-white/80 transition-colors duration-200 underline decoration-white/50 hover:decoration-white/80">
                  Login
                </NavLink>
              </span>
            </div>

            {/* Google Sign In */}
            <div className="flex flex-col items-center justify-center mt-6 pt-4 border-t border-white/20">
              <a
                href="http://localhost:3000/user/auth/google"
                className="btn w-full backdrop-blur-md bg-red-600/20 border border-red-500/30 text-red-200 font-semibold hover:bg-red-600/30 hover:border-red-500/50 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 rounded-full py-2.5"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.136 4.114-3.51 0-6.355-2.845-6.355-6.355s2.845-6.355 6.355-6.355c1.61 0 3.082.595 4.225 1.572l3.076-3.076C18.995 1.944 15.795 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.36 0 10.9-4.47 10.9-11 0-.746-.07-1.472-.19-2.185H12.24z"/>
                </svg>
                Continue with Google
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;