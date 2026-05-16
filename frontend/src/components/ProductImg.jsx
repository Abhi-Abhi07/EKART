import React, { useState } from 'react'
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'

/**
 * Product image gallery with zoom and thumbnail selection.
 * Displays a main image with zoom capability and smaller thumbnails for switching between images.
 * @param {Object} props - Component props
 * @param {Array} props.images - Array of image objects with url property
 * @returns {JSX.Element} The ProductImg component
 */
function ProductImg({images}) {
    const safeImages = images || [];
    const [mainImg, setMainImg] = useState(safeImages?.[0]?.url || "");

  return (
    <div className='flex flex-col-reverse gap-4 md:flex-row md:gap-6'>
        {/* Thumbnails */}
        <div className='flex gap-3 md:flex-col overflow-x-auto md:overflow-x-visible'>
            {
                safeImages.map((img, index)=>{
                    return (
                      <button
                        key={index} 
                        onClick={()=>setMainImg(img.url)}
                        className={`h-16 w-16 md:h-20 md:w-20 flex-shrink-0 rounded-lg border-2 object-cover shadow-sm transition-all hover:shadow-md ${
                          mainImg === img.url ? 'border-primary' : 'border-border/70'
                        }`}
                      >
                        <img 
                          src={img.url} 
                          alt='' 
                          className='w-full h-full object-cover rounded-[6px]'
                        />
                      </button>
                    )
                })
            }
        </div>

        {/* Main Image */}
        <Zoom>
            <img
              src={`${mainImg}`}
              alt="Product"
              className='w-full rounded-2xl border border-border/70 bg-card object-cover shadow-lg md:w-[460px]'
            />
        </Zoom>
    </div>
  )
}

export default ProductImg