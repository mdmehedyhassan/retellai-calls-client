import React from 'react';
import { dataArray } from '../../../data/dataArray';
import CallsComponent from '../CallsComponent/CallsComponent';

export default function Home() {
    console.log(dataArray);

    return (
        <div style={{padding: 10, background: '#eee'}}>
            <CallsComponent/>
            <h1>Total Data: {dataArray.length}</h1>
            {
                dataArray.map(dt => <div key={dt._id}>
                    <li>Call ID: {dt.call_id}</li>
                </div>)
            }
        </div>
    )
}
