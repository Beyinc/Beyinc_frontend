
import React from 'react'
import { useSearchParams } from "react-router-dom"
const PaymentSuccess = () => {

    const seachQuery = useSearchParams()[0]

    const referenceNum = seachQuery.get("reference")
    return (
        <div style={{ display: 'flex', height: '100vh', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
            <h1 style={{ textTransform: 'uppercase' }}>Order Successful</h1>
            <p>Reference No. {referenceNum}</p>
        </div>
    )
}

export default PaymentSuccess