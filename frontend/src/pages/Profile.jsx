import React, { useState } from 'react'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../assets/user.png'
import { toast } from 'sonner'
import { setUser } from '@/redux/userSlice'
import { Loader2 } from 'lucide-react'
import MyOrder from './MyOrder'
import { apiClient } from '@/services/apiClient'

function Profile() {
  const params = useParams()
  const userId = params.userId
  const { user } = useSelector(store => store.user);
  const [updateUser, setUpdateUser] = useState({
    firstName: user?.firstName,
    lastName: user?.lastName,
    email: user?.email,
    phoneNo: user?.phoneNo,
    address: user?.address,
    city: user?.city,
    zipCode: user?.zipCode,
    role: user?.role,
    profilePic: user?.profilePic
  })
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    console.log(selectedFile)
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) }) // preview only
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log(updateUser)
    setLoading(true);
    const accessToken = localStorage.getItem("accessToken")

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("email", updateUser.email)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("address", updateUser.address)
      formData.append("city", updateUser.city)
      formData.append("zipCode", updateUser.zipCode)
      formData.append("role", updateUser.role)

      if (file) {
        formData.append("file", file)
      }

      const res = await apiClient.put(`/api/v1/user/update/${userId}`, formData, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "multipart/form-data"
        }
      })

      if (res.data.success) {
        toast.success(res.data.message)
        dispatch(setUser(res.data.user))
      }

    } catch (error) {
      console.log(error);
      // toast.error(error.response.data.message);
      toast.error("Failed to Update Profile")
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className='pt-20 min-h-screen bg-background text-foreground'>
      <Tabs defaultValue="profile" className="mx-w-6xl items-center mx-auto">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <div>
            <div className='flex flex-col justify-center items-center bg-background text-foreground'>
              <h1 className='font-bold mb-7 text-2xl text-gray-800 dark:text-gray-300'>Update Profile</h1>
              <div className='w-full flex gap-10 justify-between items-start px-7 max-w-2xl'>
                {/* profile picture */}
                <div className='flex flex-col items-center'>
                  <img src={updateUser?.profilePic || userLogo} alt="profile" className='w-32 h-32 rounded-full object-cover border-4 border-primary' />
                  <Label className='mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground px-4 py-2 rounded-lg '>Change Picture
                    <input
                      type="file"
                      accept='image/*'
                      className='hidden'
                      onChange={handleFileChange}
                    />
                  </Label>
                </div>
                {/* profile form */}
                <form onSubmit={handleSubmit}  className='space-y-4 shadow-lg p-5 rounded-lg  bg-card '>
                  <div className='grid grid-cols-2 gap-4'>
                    <div>
                      <Label className='block text-sm font-medium'>First Name</Label>
                      <input
                        type="text"
                        name='firstName'
                        placeholder='John'
                        value={updateUser.firstName}
                        onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                      />
                    </div>
                    <div>
                      <Label className='block text-sm font-medium'>Last Name</Label>
                      <input
                        type="text"
                        name='lastName'
                        placeholder='Doe'
                        value={updateUser.lastName}
                        onChange={handleChange}
                        className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                      />
                    </div>
                  </div>
                  <div>
                    <Label className='block text-sm font-medium'>Email</Label>
                    <input
                      type="text"
                      name='email'
                      value={updateUser.email}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1 cursor-not-allowed'
                      disabled
                    />
                  </div>
                  <div>
                    <Label className='block text-sm font-medium'>Phone Number</Label>
                    <input
                      type="text"
                      name='phoneNo'
                      placeholder='Enter your Contact No'
                      value={updateUser.phoneNo}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                    />
                  </div>
                  <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <Label className='block text-sm font-medium'>Address</Label>
                    <input
                      type="text"
                      name='address'
                      placeholder='Enter your Address'
                      value={updateUser.address}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                    />
                  </div>
                  <div>
                    <Label className='block text-sm font-medium'>City</Label>
                    <input
                      type="text"
                      name='city'
                      placeholder='Enter your City'
                      value={updateUser.city}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                    />
                  </div>
                  </div>
                  <div>
                    <Label className='block text-sm font-medium'>Zip Code</Label>
                    <input
                      type="text"
                      name='zipCode'
                      placeholder='Enter your ZipCode'
                      value={updateUser.zipCode}
                      onChange={handleChange}
                      className='w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400'
                    />
                  </div>
                  <Button type='submit' className='w-full mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-semibold py-2 rounded-lg' >
                    {loading ? <> <Loader2 className="w-4 h-4 animate-spin mr-2"/> Please wait </>: "Update Profile"} 
                    </Button>
                </form>
              </div>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="orders">
          <MyOrder/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profile