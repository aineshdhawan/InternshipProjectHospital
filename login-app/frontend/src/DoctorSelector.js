import React, { useState, useEffect } from 'react';

function DoctorSelector() {
    const [doctors, setDoctors] = useState([]);
    const [search, setSearch] = useState('');
    const [selectedDoctor, setSelectedDoctor] = useState(null);

    useEffect(() => {
        fetchDoctors(search);
    }, [search]);

    const fetchDoctors = (name) => {
        let url = 'http://localhost:3001/api/doctors';
        if (name) {
            url += `?name=${name}`;
        }

        fetch(url)
    .then(response => {
        console.log(response);  // Check the raw response
        if (!response.ok) {
            throw new Error(`HTTP status ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log(data);  // Check the JSON data
        setDoctors(data);
    })
    .catch(error => console.error('Error fetching doctors:', error));

    };

    const handleSearchChange = (event) => {
        setSearch(event.target.value);
    };

    const handleDoctorSelect = (doctor) => {
        setSelectedDoctor(doctor);
    };

    return (
        <div>
            <input 
                type="text" 
                value={search} 
                onChange={handleSearchChange} 
                placeholder="Search doctors by name"
            />
            {doctors.length > 0 && (
                <ul>
                    {doctors.map(doctor => (
                        <li key={doctor.id} onClick={() => handleDoctorSelect(doctor)}>
                            {doctor.name}
                        </li>
                    ))}
                </ul>
            )}
            {selectedDoctor && (
                <div>
                    <h3>Doctor Details</h3>
                    <p>Name: {selectedDoctor.name}</p>
                    <p>Specialty: {selectedDoctor.specialty}</p>
                </div>
            )}
        </div>
    );
}

export default DoctorSelector;
