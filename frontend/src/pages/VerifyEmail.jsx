import React, { useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/services/apiClient'

function VerifyEmail() {
    const {token} = useParams()
    const [status, setStatus] = useState("Verifying...")
    const navigate = useNavigate();
    useEffect(() => {
        const verifyEmail = async () => {
            try {
                const res = await apiClient.post(`/api/v1/user/verify`,{}, {
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if(res.data.success){
                    setStatus("✅ Email Verified Successfully")
                    setTimeout(()=>{
                            navigate("/login");
                    },2000)
                }
            } catch (error) {
                console.log(error)
                setStatus("❌ Verification failed. Please try again.")
            }
        }

        verifyEmail();
    }, [token, navigate])
  return (
    <div className="relative w-full h-[760px] bg-background overflow-hidden">
        <div className='min-h-screen flex items-center justify-center'>
            <div className='bg-white p-6 rounded-2xl shadow-md text-center w-[90%] max-w-md'>
                <h2 className='text-xl font-semibold text-gray-800'>{status}</h2>
            </div>
        </div>
    </div>
  )
}

export default VerifyEmail