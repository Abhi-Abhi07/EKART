import React from 'react'
import { Link } from 'react-router-dom'
import { FaFacebook, FaTwitterSquare, FaInstagram, FaPinterest, } from 'react-icons/fa'
function Footer() {
  return (
    <footer className='bg-slate-50 text-slate-700 py-10 border-t border-slate-200 dark:bg-[#0f172a] dark:text-slate-300 dark:border-slate-800'>
        <div className='max-w-6xl mx-auto px-4 md:justify-between grid grid-cols-4'>
            {/* info */}
            <div className='mb-6 md:mb-0'>
                <Link to='/'>
                    <img src="/Ekart.png" alt="" className='w-24'/>
                </Link>
                <p className='mt-2 text-sm'>Powering Your World with the Best in electronics.</p>
                <p className='mt-2 text-sm'>123 electronics st, Style city, NY 10001</p>
                <p className='text-sm'>Email: support@Zaptro.com</p>
                <p className='text-sm'>Phone: (123) 456-7890</p>
            </div>
            {/* customer service link */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Customer Service</h3>
                <ul className='mt-2 text-sm space-y-2'>
                    <li><a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Contact Us</a></li>
                    <li><a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Shipping & Returns</a></li>
                    <li><a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">FAQs</a></li>
                    <li><a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Order Tracking</a></li>
                    <li><a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors">Size Guide</a></li>
                </ul>
            </div>
            {/* Social media links */}
            <div className='mb-6 md:mb-0'>
                <h3 className='text-xl font-semibold'>Follow Us</h3>
                <div className='flex space-x-4 mt-2'>
                    <a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"><FaFacebook/></a>
                    <a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"><FaInstagram/></a>
                    <a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"><FaTwitterSquare/></a>
                    <a href="#" class="text-slate-600 hover:text-indigo-600 dark:text-slate-400 dark:hover:text-indigo-400 transition-colors"><FaPinterest/></a>
                </div>
            </div>
            {/* newsletter subscription */}
            <div>
                <h3 className='text-xl font-semibold'>Stay in the Loop</h3>
                <p className='mt-2 text-sm'>Subscribe to get special offers, free giveways, and more</p>
                <form action="" className='mt-4 flex'>
                    <input 
                    type="email"
                    placeholder='Your email address'
                    className='w-full p-2 rounded-l-md bg-white text-black placeholder:text-gray-400 focus:outline-none outline-none focus:ring-1 focus:ring-gray-500'
                    />
                    <button type='submit' className=' px-4 rounded-r-md bg-primary text-primary-foreground hover:bg-secondary hover:text-secondary-foreground cursor-pointer'>
                        Subscribe
                    </button>
                </form>
            </div>
        </div>
        {/* bottom section */}
        <div className='mt-8 border-t  border-slate-200  pt-6 text-center text-sm'>
            <p>&copy; {new Date().getFullYear()} <span className='text-pink-600'>Ekart</span>. All rights reserved</p>
        </div>
    </footer>
  )
}

export default Footer