import React from 'react'
import Button from '../components/Button'

function HomeBanner() {
  return (
    <section className="bg-[url(./img/mountains.jpg)] h-screen bg-cover">
        <p className="text-white">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laboriosam accusantium fugiat reiciendis nostrum quisquam voluptate in quas et, eveniet perferendis rerum illo eligendi, ex consequatur labore cumque fugit. Expedita, quae?</p>
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Hello</button>

        <Button title="Green" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"/>  

    </section>
  )
}

export default HomeBanner