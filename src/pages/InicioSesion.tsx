import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LoginForm } from '../features/auth/components/LoginForm'
import { RegisterForm } from '../features/auth/components/RegisterForm'
import { useAuth } from '../features/auth/hooks/useAuth'
import { AuthLayout } from '../components/layout'
import reactLogo from '../assets/react.svg'

export default function InicioSesion() {
    const navigate = useNavigate()
    const { login, register, isLoading, error, isAuthenticated } = useAuth()
    const [isRegisterMode, setIsRegisterMode] = useState(false)

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/home', { replace: true })
        }
    }, [isAuthenticated, navigate])

    const handleLogin = async (email: string, password: string) => {
        await login(email, password)
    }

    const handleRegister = async (email: string, password: string) => {
        await register(email, password)
    }

    const handleToggle = () => setIsRegisterMode((v) => !v)

    // Ilustración para login
    const loginIllustration = {
        imageSrc: reactLogo,
        imageAlt: 'React Logo',
        title: 'SmarthClose AI',
        description: 'Bienvenido a tu sistema de cierre de caja inteligente',
        gradientFrom: 'from-orange-500',
        gradientVia: 'via-red-600',
        gradientTo: 'to-purple-700'
    }

    // Ilustración para registro
    const registerIllustration = {
        icon: (
            <svg className="w-32 h-32" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
        ),
        title: 'Únete a la Comunidad',
        description: 'Sé parte de nuestra aventura cultural y descubre Huánuco',
        gradientFrom: 'from-blue-500',
        gradientVia: 'via-purple-600',
        gradientTo: 'to-pink-600'
    }

    return (
        <AuthLayout illustration={isRegisterMode ? registerIllustration : loginIllustration}>
            {isRegisterMode ? (
                <RegisterForm
                    onSubmit={handleRegister}
                    isLoading={isLoading}
                    error={error}
                    onToggle={handleToggle}
                />
            ) : (
                <LoginForm
                    onSubmit={handleLogin}
                    isLoading={isLoading}
                    error={error}
                    onToggle={handleToggle}
                />
            )}
        </AuthLayout>
    )
}
