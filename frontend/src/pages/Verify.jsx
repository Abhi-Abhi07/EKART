import React from 'react'

function Verify() {
  return (
    <div className="relative w-full h-[760px] overflow-hidden">
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
            <div className='bg-white p-8 rounded-2xl shadow-lg w-full max-w-md text-center'>
                <h2 className='mb-4 text-2xl font-semibold text-green-500'>✅ Check Your Email</h2>
                <p className='text-gray-400 text-sm'>We have sent you an email to verify your account. Please check your inbox and click the verification link.</p>
            </div>
        </div>
    </div>
  )
}

export default Verify