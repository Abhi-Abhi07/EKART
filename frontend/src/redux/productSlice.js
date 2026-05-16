// Product slice stores catalog, cart, address, and wishlist state.

import { createSlice } from "@reduxjs/toolkit";

const productSlice = createSlice({
    name : "product",
    initialState:{
        products:[],
        cart: [],
        addresses: [],
        wishlist: [],
        selectedAddress:null //currently chosen address
    },
    reducers:{
        // actions
        setProducts:(state,action)=>{
            state.products = action.payload
        },
        setCart:(state, action) => {
            state.cart = action.payload
        },
        toggleWishlistItem: (state, action) => {
            const product = action.payload;
            if (!product || !product._id) {
                return;
            }
            const wishlist = Array.isArray(state.wishlist) ? state.wishlist : [];
            const exists = wishlist.some((item) => item._id === product._id);
            if (exists) {
                state.wishlist = wishlist.filter((item) => item._id !== product._id);
                return;
            }
            state.wishlist = [...wishlist, product];
        },

        //  Address Management
        addAddress:(state, action)=>{
            if(!state.addresses) state.addresses = [];
            state.addresses.push(action.payload)
        },
        setSelectedAddress:(state,action)=>{
            state.selectedAddress = action.payload
        },
        deleteAddress:(state,action)=>{
            state.addresses=state.addresses.filter((_,index)=> index !== action.payload)

            // Reset selectedAddress if it was deleted
            if(state.selectedAddress === action.payload){
                state.selectedAddress = null
            }
        }
    }
})

export const {setProducts, setCart, toggleWishlistItem, addAddress, setSelectedAddress, deleteAddress} = productSlice.actions
export default productSlice.reducer