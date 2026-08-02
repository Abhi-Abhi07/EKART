import React, { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import userLogo from "../assets/user.png";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { Loader2 } from "lucide-react";
import MyOrder from "./MyOrder";
import { userService } from "@/services/userService";

function Profile() {
  const params = useParams();
  const userId = params.userId;
  const { user } = useSelector((store) => store.user);

  // Address is now a subdocument: { street, city, state, zipCode, country }
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName:  user?.lastName  || "",
    email:     user?.email     || "",
    phoneNo:   user?.phoneNo   || "",
    street:    user?.address?.street  || "",
    city:      user?.address?.city    || "",
    state:     user?.address?.state   || "",
    zipCode:   user?.address?.zipCode || "",
    country:   user?.address?.country || "India",
    role:      user?.role      || "user",
    profilePic: user?.profilePic || "",
  });

  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    setFile(selectedFile);
    setFormData({ ...formData, profilePic: URL.createObjectURL(selectedFile) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      data.append("firstName", formData.firstName);
      data.append("lastName",  formData.lastName);
      data.append("phoneNo",   formData.phoneNo);
      // Address subdocument fields sent as flat FormData fields
      data.append("street",  formData.street);
      data.append("city",    formData.city);
      data.append("state",   formData.state);
      data.append("zipCode", formData.zipCode);
      data.append("country", formData.country);
      data.append("role",    formData.role);

      if (file) {
        data.append("file", file);
      }

      // Cookie auto-sent — no manual Authorization header needed
      const res = await userService.updateProfile(userId, data);
      if (res.data.success) {
        toast.success(res.data.message);
        dispatch(setUser(res.data.user));
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-20 min-h-screen bg-background text-foreground">
      <Tabs defaultValue="profile" className="mx-w-6xl items-center mx-auto">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="flex flex-col justify-center items-center bg-background text-foreground">
            <h1 className="font-bold mb-7 text-2xl text-gray-800 dark:text-gray-300">
              Update Profile
            </h1>
            <div className="w-full flex gap-10 justify-between items-start px-7 max-w-2xl">
              {/* Profile picture */}
              <div className="flex flex-col items-center">
                <img
                  src={formData.profilePic || userLogo}
                  alt="profile"
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
                <Label className="mt-4 cursor-pointer bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground px-4 py-2 rounded-lg">
                  Change Picture
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </Label>
              </div>

              {/* Profile form */}
              <form onSubmit={handleSubmit} className="space-y-4 shadow-lg p-5 rounded-lg bg-card flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">First Name</Label>
                    <input
                      type="text"
                      name="firstName"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Last Name</Label>
                    <input
                      type="text"
                      name="lastName"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                </div>

                <div>
                  <Label className="block text-sm font-medium">Email</Label>
                  <input
                    type="text"
                    name="email"
                    value={formData.email}
                    className="w-full border rounded-lg px-3 py-2 mt-1 cursor-not-allowed opacity-60 bg-muted"
                    disabled
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Phone Number</Label>
                  <input
                    type="text"
                    name="phoneNo"
                    placeholder="Enter your contact number"
                    value={formData.phoneNo}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium">Street</Label>
                  <input
                    type="text"
                    name="street"
                    placeholder="123 Main Street, Area"
                    value={formData.street}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">City</Label>
                    <input
                      type="text"
                      name="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">State</Label>
                    <input
                      type="text"
                      name="state"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="block text-sm font-medium">Zip Code</Label>
                    <input
                      type="text"
                      name="zipCode"
                      placeholder="400001"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                  <div>
                    <Label className="block text-sm font-medium">Country</Label>
                    <input
                      type="text"
                      name="country"
                      placeholder="India"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full border rounded-lg px-3 py-2 mt-1 placeholder:text-gray-400 bg-background"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full mt-4 bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground font-semibold py-2 rounded-lg"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" /> Please wait
                    </>
                  ) : (
                    "Update Profile"
                  )}
                </Button>
              </form>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <MyOrder />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Profile;