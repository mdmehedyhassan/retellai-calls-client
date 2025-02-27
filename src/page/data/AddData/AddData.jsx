
import { Undo2 } from 'lucide-react'
import React, { useState } from 'react'
import { Link } from 'react-router'

export default function AddData() {
    const [api_key, set_api_key] = useState("");
    const [authorization, set_authorization] = useState("");
    const [getData, set_getData] = useState({});
    const [buttonDisable, setButtonDisable] = useState(false)
    const onsubmitHandler = () => {
        setButtonDisable(true);
        fetch('https://retellai-ghl.vercel.app/post-retell-calls', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                "authorization": `Bearer ${authorization}`,
                "apikey": api_key
            },
        })
            .then(res => res.json())
            .then(data => {
                set_getData(data);
                setButtonDisable(false);
            })
            .catch(err => {
                console.log(err);
                setButtonDisable(false);
                alert("Something Wrong Please Try Again Later...")
            })
    }
    return (
        <div className='p-5'>
            <div className='flex'>
                <Link to="/"><button className='
             mt-5 bg-gray-500 py-2 px-5 
             font-bold text-white
             flex gap-2 items-center rounded-sm
             '>
                    <Undo2 className='h-5' />
                    Return Home</button></Link>
            </div>
            <div className='border border-[#00000025] p-5 mt-5 rounded-lg'>
                <label htmlFor="api_key">
                    <div className='cursor-pointer'>
                        <p className='mt-5 mb-1'>API Key:</p>
                        <input
                            onChange={e => set_api_key(e.target.value)}
                            id="api_key"
                            style={{
                                width: "100%",
                                borderRadius: 5,
                                border: '1px solid #00000025',
                                padding: '5px 10px'
                            }} type="text"
                            placeholder='Enter API KEY' />
                    </div>
                </label>
                <label htmlFor="authorization">
                    <div className='cursor-pointer'>
                        <p className='mt-5 mb-1'>Authorization Token:</p>
                        <input
                            onChange={e => set_authorization(e.target.value)}
                            id="authorization"
                            style={{
                                width: "100%",
                                borderRadius: 5,
                                border: '1px solid #00000025',
                                padding: '5px 10px'
                            }} type="text"
                            placeholder='Enter Authorization Token' />
                    </div>
                </label>
                <button
                    onClick={onsubmitHandler}
                    style={{
                        cursor: buttonDisable ? "not-allowed" : "pointer"
                    }}
                    className={`
                        rounded-full mt-5 
                        ${buttonDisable ? 'bg-gray-500' : 'bg-blue-500'} 
                        py-2 px-5 
                        font-bold text-white
                    `}>Submit</button>
            </div>
            {
                getData.matchedCount ?
                    <div >
                        <h2 style={{
                            fontSize: 30,
                            fontWeight: 700,
                            color: 'green'
                        }}>New Data Added {getData.matchedCount}</h2>
                    </div>
                    :
                    null
            }
        </div>
    )
}
