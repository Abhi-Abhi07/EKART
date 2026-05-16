import React from 'react'
import { Input } from './ui/input'
import { Button } from './ui/button'

function FilterSidebar({allProducts, priceRange, setPriceRange, search, setSearch, category, setCategory, brand, setBrand, setSortOrder}) {
  const Categories = allProducts.map(prod => prod.category)
  const uniqueCategories = ["All", ...new Set(Categories)]
  // console.log(uniqueCategories)
  const Brands = allProducts.map(prod => prod.brand)
  const uniqueBrands = ["All", ...new Set(Brands)]
  console.log(uniqueBrands)

  const handleCategoryClick = (val) => {
    setCategory(val);
  }

  const handleBrandChange = (e) =>{
    setBrand(e.target.value)
  }

  const handleMinChange = (e) =>{
    const value = Number(e.target.value)

    if(value <= priceRange[1]){
      setPriceRange([value,priceRange[1]])
    }
  }

  const handleMaxChange = (e) =>{
    const value = Number(e.target.value)

    if(value >= priceRange[0]){
      setPriceRange([priceRange[0],value])
    }
  }

  const resetFilters = () => {
    setSearch("")
    setCategory("All")
    setBrand("All")
    setPriceRange([0,999999])
    setSortOrder("")
  }

  return (
    <div className='bg-gray-100 mt-10 p-4 border-2 rounded-md h-max hidden md:block w-64 dark:bg-indigo-300/10'>
      {/* Search  */}
      <Input
        type='text'
        placeholder='Search...'
        value={search}
        onChange={(e)=>setSearch(e.target.value)}
        className='bg-white p-2 rounded-md border-gray-400 border-2 w-full'
      />
      {/* Category  */}
      <h1 className='mt-5 font-semibold text-xl'>Category</h1>
      <div className='flex flex-col gap-2 mt-3'>
        {
          uniqueCategories.map((item,index)=>(
            <div key={index}  className='flex items-center gap-2'>
              <input 
                type="radio" 
                checked={category === item} 
                onChange={()=>handleCategoryClick(item)}
              />
              <label htmlFor="">{item}</label>
            </div>
          ))
        }
      </div>
      {/* Brands  */}
      <h1 className='mt-5 font-semibold text-xl'>Brands</h1>
      <select className='bg-white dark:bg-gray-900 dark:border-gray-800 dark:border-2 outline-none w-full p-2 border-gray-200 border-2 rounded-md' value={brand} onChange={handleBrandChange}>
        {
          uniqueBrands.map((item,index)=>(
            <option key={index} value={item} >{item.toUpperCase()}</option>
          ))
        }
      </select>
      {/* price range */}
      <h1 className='mt-5 font-semibold text-xl mb-3'>Price Range</h1>
      <div className='flex flex-col gap-2'>
        <label htmlFor="">
          Price Range: ₹{priceRange[0]}-₹{priceRange[1]}
        </label>
        <div className='flex gap-2 items-center'>
          <input 
            type="number"
            min='0'
            max='5000'
            className='w-20 p-1 border border-gray-300 rounded' 
            value={priceRange[0]}
            onChange={handleMinChange}
          />
          <span>-</span>
          <input 
            type="number"
            min='0'
            max='999999'
            className='w-20 p-1 border border-gray-300 rounded' 
            value={priceRange[1]}
            onChange={handleMaxChange}
          />
        </div>
        <input 
          type="range" 
          min="0"
          max='999999'
          step='100'
          className='w-full'
          value={priceRange[0]}
          onChange={handleMinChange}
        />
        <input 
          type="range" 
          min="0"
          max='999999'
          step='100'
          className='w-full'
          value={priceRange[1]}
          onChange={handleMaxChange}
        />
      </div>
      {/* Reset button */}
      <Button className="bg-primary text-primary-foreground mt-5 cursor-pointer w-full" onClick={resetFilters} >Reset Filters</Button>
    </div>
    
  )
}

export default FilterSidebar