import { useState } from "react"
import { useRegistration } from "../hooks/useRegistration"

const Registration = () => {
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [role, setRole] = useState('')
    const [languages, setLanguages] = useState('')
    const [inputerror, setInputError] = useState(null)
    const { registration, isLoading, error } = useRegistration()

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            setInputError('Incorrect Password')
            return
        }
        setInputError('')
        await registration(userName, email, password, role, languages)
    }

    return (
        <form className="register" onSubmit={handleSubmit}>
            <h3>Create an account</h3>
            <label>User Name:</label>
            <input
                type="text"
                onChange={(e) => setUserName(e.target.value)}
                value={userName}
            />
            <label>Email:</label>
            <input
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                value={email}
            />
            <label>Password:</label>
            <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                value={password}
            />
            <label>Confirm Password:</label>
            <input
                type="password"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
            />
            <label>Role:</label>
            <select onChange={(e) => setRole(e.target.value)}>
                <option value="">Select Role</option>
                <option value="Translator">Translator</option>
                <option value="Developer">Developer</option>
                <option value="Admin">Admin</option>
            </select>
            {role === "Translator" && (
                <>
                    <label>Languages:</label>
                    <input
                        type="text"
                        onChange={(e) => setLanguages(e.target.value)}
                        value={languages}
                        placeholder="Enter languages (comma separated)"
                    />
                </>
            )}
            <button disabled={isLoading}>Send to Approval</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}

export default Registration