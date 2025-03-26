import React from 'react'
import Navbar from '../components/navbar/Navbar'
import Footer from '../components/footer/Footer'
import Explore from './explore/Explore'
import ChatBot from './chatBot/ChatBot'
const Home = () => {
  return (
    <div>
        <Explore/>
        <ChatBot/>
    </div>
  )
}

export default Home