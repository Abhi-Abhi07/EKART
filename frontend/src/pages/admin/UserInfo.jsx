import { Button } from "@/components/ui/button";
import PageTransition from "@/components/PageTransition";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from 'react'
import { Label } from '@/components/ui/label'
import { useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import userLogo from '../../assets/user.png'
import { toast } from 'sonner'
import axios from 'axios'
import { setUser } from '@/redux/userSlice'
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { apiClient } from "@/services/apiClient";

/**
 * Admin page for viewing and updating user profile information.
 * Allows admins to edit user details, profile picture, and role.
 * @returns {JSX.Element} The UserInfo component
 */
function UserInfo() {
  const navigate = useNavigate();
  const { user } = useSelector(store => store.user);
  const [updateUser, setUpdateUser] = useState(null)
  const [file, setFile] = useState(null)
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false);
  const params = useParams()
  const userId = params.id;

  const handleChange = (e) => {
    setUpdateUser({ ...updateUser, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile)
    setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", updateUser.firstName)
      formData.append("lastName", updateUser.lastName)
      formData.append("phoneNo", updateUser.phoneNo)
      formData.append("street",  updateUser.street  || updateUser.address || "")
      formData.append("city",    updateUser.city    || "")
      formData.append("state",   updateUser.state   || "")
      formData.append("zipCode", updateUser.zipCode || "")
      formData.append("country", updateUser.country || "India")
      formData.append("role",    updateUser.role)

      if (file) {
        formData.append("file", file)
      }

      // Cookie auto-sent — no manual Authorization header needed
      const res = await apiClient.put(`/api/v1/user/${userId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      })

      if (res.data.success) {
        toast.success(res.data.message)
        if (user && user._id === res.data.user._id) {
          dispatch(setUser(res.data.user))
        }
      }

    } catch (error) {
      toast.error("Failed to update profile")
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await apiClient.get(`/api/v1/user/${userId}`)
        if (res.data.success) {
          setUpdateUser(res.data.user)
        }
      } catch (error) {
        console.error(error)
        toast.error(error?.response?.data?.message || "Failed to load user details")
      }
    }

    if (userId) {
      fetchUserDetails()
    }
  }, [userId])

  return (
    <div className="bg-background min-h-screen p-6">
      <PageTransition>
        <div className="max-w-4xl mx-auto">
          <Button 
            onClick={() => navigate(-1)} 
            variant="outline" 
            size="sm"
            className="mb-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="grid md:grid-cols-4 gap-6">
            {/* Profile Picture Section */}
            <Card className='bg-card p-6 flex flex-col items-center justify-center md:col-span-1 h-fit shadow-sm'>
              <img
                src={updateUser?.profilePic || userLogo}
                alt="profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-border mb-4"
              />
              <Label className="cursor-pointer bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 text-sm font-medium w-full text-center">
                Change Picture
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </Label>
            </Card>

            {/* Form Section */}
            <Card className='bg-card p-6 md:col-span-3 shadow-sm'>
              <h1 className='text-2xl font-bold text-foreground mb-6'>Update Profile</h1>
              <form onSubmit={handleSubmit} className='space-y-4'>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">First Name</Label>
                    <Input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={updateUser?.firstName || ''}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Last Name</Label>
                    <Input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={updateUser?.lastName || ''}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Email (Read-only)</Label>
                  <Input
                    type="email"
                    name="email"
                    value={updateUser?.email || ''}
                    disabled
                    className="mt-1 bg-muted"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">Phone Number</Label>
                  <Input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter phone number"
                    value={updateUser?.phoneNo || ''}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium">Address</Label>
                    <Input
                      type="text"
                      name="address"
                      placeholder="Enter address"
                      value={updateUser?.address || ''}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-medium">City</Label>
                    <Input
                      type="text"
                      name="city"
                      placeholder="Enter city"
                      value={updateUser?.city || ''}
                      onChange={handleChange}
                      className="mt-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Zip Code</Label>
                  <Input
                    type="text"
                    name="zipCode"
                    placeholder="Enter zip code"
                    value={updateUser?.zipCode || ''}
                    onChange={handleChange}
                    className="mt-1"
                  />
                </div>

                <div className="border-t border-border pt-4">
                  <Label className='text-sm font-medium block mb-3'>Role</Label>
                  <RadioGroup 
                    value={updateUser?.role || 'user'}
                    onValueChange={(value)=> setUpdateUser({...updateUser, role: value})} 
                    className="flex gap-6"
                  >
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='user' id='user' />
                      <Label htmlFor='user' className="font-normal cursor-pointer">User</Label>
                    </div>
                    <div className='flex items-center space-x-2'>
                      <RadioGroupItem value='admin' id='admin' />
                      <Label htmlFor='admin' className="font-normal cursor-pointer">Admin</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                        Updating...
                      </>
                    ) : (
                      "Update Profile"
                    )}
                  </Button>
                </div>
              </form>
            </Card>
          </div>
        </div>
      </PageTransition>
    </div>
  );
}

export default UserInfo;
