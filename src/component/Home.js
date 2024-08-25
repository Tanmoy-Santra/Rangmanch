import React from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import model1 from './Assets/model3.png'
import model2 from './Assets/model1.png'
import model3 from './Assets/model4.png'
import { Link } from 'react-router-dom'

const Home = () => {
  return (
    <div>
        <Navbar/>
        <div className="bg-white overflow-hidden relative lg:flex lg:items-center my-20 bg-custom-middle">
    <div className="w-full py-12 px-4 sm:px-6 lg:py-16 lg:px-8 z-20">
        <h2 className="text-3xl font-extrabold text-black sm:text-4xl text-white">
            <span className="block">
            Welcome to Rangmanch
            </span>
        </h2>
        <p className="text-md mt-4 text-gray-500 text-white ">
            TDiscover the beauty of unique, handcrafted items created with love and care. Each piece tells a story and adds a personal touch to your home and life.
        </p>
        <div className="lg:mt-0 lg:flex-shrink-0">
            <div className="mt-12 inline-flex rounded-md shadow">
                <Link to='/Product' type="button" className="py-2 px-4 bg-green-500 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 rounded-lg btn-custom-color">
                    Explore Our Collection
                </Link>
            </div>
        </div>
    </div>
    <div className="flex items-center gap-8 p-8 lg:p-24">
        <img src={model1} className="w-1/2 rounded-lg bg-color-model" alt="Tree"/>
        <div>
            <img src={model2} className="mb-8 rounded-lg bg-color-model" alt="Tree"/>
            <img src={model3} className="rounded-lg bg-color-model" alt="Tree"/>
        </div>
    </div>
</div>




<div className="relative  flex items-center bg-white dark:bg-gray-800 bg-custom-middle">
    <div className="container relative flex flex-col items-center justify-between px-6 py-8 mx-auto ">
        <div className="flex flex-col">
            <h1 className="w-full text-4xl font-light text-center text-gray-800 uppercase sm:text-3xl dark:text-white text-white ">
                Enhance Your Home with Handmade Crafts
            </h1>
            <hr className="w-half my-2 border-white-300 dark:border-white-600"/>
            <h2 className="w-full max-w-2xl py-8 mx-auto text-l font-light text-center text-gray-800 dark:text-white text-white font-bold ">
                Handmade crafts enrich homes with unique charm and personalization. They showcase meticulous craftsmanship and attention to detail, offering quality and authenticity that mass-produced items often lack. These crafts support local artisans, promote sustainability, and use eco-friendly materials, contributing to a more conscious lifestyle. They not only enhance home aesthetics but also tell stories of creativity and passion, adding warmth and character to living spaces.
            </h2>
            <div className="flex items-center justify-center mt-4 ">
                <Link to="/Product" className="px-4 py-2 mr-4 text-white uppercase bg-gray-800 text-md hover:bg-gray-900 btn-custom-color">
                    Get started
                </Link>
            </div>

        </div>
    </div>
</div>



<div className="px-4 py-20 bg-lightblue text-white">
    <div className="flex flex-col max-w-6xl mx-auto md:flex-row">
        <h2 className="w-full mr-8 text-3xl font-extrabold leading-9 md:w-1/3">
            Frequently-asked questions
            <hr className="w-half my-2 border-white-300 dark:border-white-600"/>
        </h2>
        <dl className="w-full md:w-2/3">
            <dt className="mb-4">
                <h3 className="text-xl font-semibold">
                    Why should I choose handmade crafts over mass-produced items?
                </h3>
            </dt>
            <dd className="mb-16">
                <p>
                    Handmade crafts bring a unique charm and personal touch to your home. Each piece is carefully crafted with attention to detail, offering a level of quality and authenticity that mass-produced items often lack. Additionally, supporting handmade crafts helps promote local artisans and sustainable practices.
                </p>
            </dd>
            <dt className="mb-4">
                <h3 className="text-xl font-semibold">
                    Are handmade crafts more expensive than mass-produced items?
                </h3>
            </dt>
            <dd className="mb-16">
                <p>
                    While handmade crafts can sometimes be more expensive due to the time and skill involved in creating them, they offer better quality, durability, and uniqueness. You're also investing in a piece of art that carries the story and passion of its creator.
                </p>
            </dd>
            <dt className="mb-4">
                <h3 className="text-xl font-semibold">
                    How can I be sure of the quality of handmade crafts?
                </h3>
            </dt>
            <dd className="mb-16">
                <p>
                    Handmade crafts are typically made with great care and precision, often using high-quality materials. Many artisans take pride in their work, ensuring that each piece meets a high standard. Additionally, handmade items are usually subject to more rigorous quality checks by the creator.
                </p>
            </dd>
            <dt className="mb-4">
                <h3 className="text-xl font-semibold">
                    Are handmade crafts eco-friendly?
                </h3>
            </dt>
            <dd className="mb-16">
                <p>
                    Yes, many handmade crafts are created using sustainable and eco-friendly materials. Artisans often source materials locally and focus on minimizing waste, making handmade crafts a great choice for those looking to reduce their environmental impact.
                </p>
            </dd>
            <dt className="mb-4">
                <h3 className="text-xl font-semibold">
                    How do I maintain and care for handmade crafts?
                </h3>
            </dt>
            <dd className="mb-16">
                <p>
                    Care instructions for handmade crafts vary depending on the material. Generally, it's important to keep them away from direct sunlight, excessive moisture, and extreme temperatures. Regular dusting and gentle cleaning with appropriate products will help maintain their beauty and longevity.
                </p>
            </dd>
        </dl>
    </div>
</div>


      
      <Footer/>     
    </div>
  )
}

export default Home
