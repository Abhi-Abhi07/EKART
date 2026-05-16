import { Input } from '@/components/ui/input'
import PageTransition from '@/components/PageTransition'
import { Edit, Eye, Search } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import UserLogo from "../../assets/user.png"
import axios from 'axios'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { Card } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { toast } from 'sonner'

/**
 * Admin page for user management displaying all registered users with search and filter.
 * Allows editing user profiles and viewing their orders.
 * @returns {JSX.Element} The AdminUsers component
 */
function AdminUsers() {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const getAllUsers = async() =>{
    const accessToken = localStorage.getItem("accessToken")
    try {
      setLoading(true)
      const res = await axios.get(`${import.meta.env.VITE_URL}/api/v1/user/all-user`,{
        headers:{
          Authorization: `Bearer ${accessToken}`
        }
      })
      if(res.data.success){
        setUsers(res.data.users)
      }
    } catch (error) {
      console.log(error)
      toast.error("Failed to load users")
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user=>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(()=>{
    getAllUsers();
  },[])

  return (
    <div className='bg-background min-h-screen p-6'>
      <PageTransition>
        <div className="max-w-6xl mx-auto">
          <div className="mb-6">
            <h1 className="font-bold text-3xl text-foreground">User Management</h1>
            <p className="text-muted-foreground mt-1">View and manage registered users</p>
          </div>
          
          <div className="relative w-full md:w-[300px] mb-6">
            <Search className='absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4'  />
            <Input 
              value={searchTerm} 
              onChange={(e)=>setSearchTerm(e.target.value)} 
              placeholder="Search users by name or email..." 
              className='pl-4 pr-10 bg-card'
            />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({length: 6}).map((_, i) => (
                <Skeleton key={i} className="h-48" />
              ))}
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No users found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {
                filteredUsers.map((user) => {
                  return (
                    <Card key={user._id} className="bg-card p-4 shadow-sm hover:shadow-md transition">
                      <div className="flex items-center gap-3 mb-4">
                        <img 
                          src={user?.profilePic || UserLogo} 
                          alt={user?.firstName} 
                          className='rounded-full w-12 h-12 object-cover border border-border' 
                        />
                        <div className="flex-1 min-w-0">
                          <h1 className='font-semibold text-foreground truncate'>{user?.firstName} {user?.lastName}</h1>
                          <p className='text-xs text-muted-foreground truncate'>{user?.email}</p>
                        </div>
                      </div>
                      <div className='flex gap-2'>
                        <Button 
                          onClick={()=>navigate(`/dashboard/users/${user?._id}`)} 
                          variant='outline' 
                          size="sm"
                          className='flex-1'
                        >
                          <Edit className='w-4 h-4 mr-1'/>
                          Edit
                        </Button>
                        <Button 
                          onClick={()=>navigate(`/dashboard/users/orders/${user?._id}`)} 
                          size="sm"
                          className='flex-1'
                        >
                          <Eye className='w-4 h-4 mr-1'/>
                          Orders
                        </Button>
                      </div>
                    </Card>
                  )
                })
              }
            </div>
          )}
        </div>
      </PageTransition>
    </div>
  )
}

export default AdminUsers