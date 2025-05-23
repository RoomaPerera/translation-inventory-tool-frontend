import { useState } from "react"
import { useAuthContext } from './useAuthContext'

export const useRegistration = () => {
    const [error, setError] = useState(null)
    const [isLoading, setIsLoading] = useState(null)
    const { dispatch } = useAuthContext()

    const registration = async (userName, email, password, role, languages) => {
        setIsLoading(true)
        setError(null)

        const response = await fetch('http://localhost:4000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userName, email, password, role, languages })
        })
        const json = await response.json()
        if (!response.ok) {
            setIsLoading(false)
            setError(json.error)
        }
        if (response.ok) {
            //save the user to the local storage
            localStorage.setItem('user', JSON.stringify(json))

            //update the AuthContext
            dispatch({ type: 'LOGIN', payload: json })
            setIsLoading(false)
        }
    }
    return { registration, isLoading, error }
}