import { useState, useEffect } from "react";
import "./Generalcomponents.css"

export default function ConsCard () {

     const [services, setServices] = useState([]);

    useEffect(() => {
        fetch('http://localhost:3001/services')
            .then(res => res.json())
            .then(data => {
                setServices(data);
            });})

    return (
        <>
            {services.map(service => (
            <div className="card-header" key={service.id}>
                <div>
                    <img src={service.img} alt={service.name} />
                </div>
                
                <div className="card-content">
                    <span>{service.title}</span>
                    <span>{service.category}</span>
                    <span>{service.location}</span>
                </div>
                
            </div>
            ))}
            
        </>
    )
}