"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    const fetchAdvocates = async function() {
      try {
        console.log("fetching advocates...");
        const response = await fetch("/api/advocates")

        if (!response.ok) {
          throw new Error("Request to fetch advocates failed.");
        }

        const jsonResponse = await response.json()
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.log("Failed to fetch advocates with error: " + error)
      }
    }
    
    fetchAdvocates()
  }, []);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedTerm = e.target.value;

    setSearchTerm(searchedTerm)

    console.log("filtering advocates...");

    const filteredAdvocates = advocates.filter((advocate: Advocate) => {
      const lowerCaseTerm = searchTerm.toLowerCase()

      return (
        advocate.firstName.toLowerCase().includes(lowerCaseTerm) ||
        advocate.lastName.toLowerCase().includes(lowerCaseTerm) ||
        advocate.city.toLowerCase().includes(lowerCaseTerm) ||
        advocate.degree.toLowerCase().includes(lowerCaseTerm) ||
        advocate.specialties.map(specialty => specialty.toLowerCase()).some(specialty => specialty.includes(lowerCaseTerm)) ||
        advocate.yearsOfExperience.toString().includes(lowerCaseTerm)
      );
    });

    setFilteredAdvocates(filteredAdvocates);
  };

  const onClick = () => {
    console.log(advocates);
    setFilteredAdvocates(advocates);
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1>Solace Advocates</h1>
      <br />
      <br />
      <div>
        <p>Search</p>
        <p>
          Searching for: <span id="search-term">{searchTerm}</span>
        </p>
        <input style={{ border: "1px solid black" }} onChange={onChange} />
        <button onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table>
        <thead>
          <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>City</th>
            <th>Degree</th>
            <th>Specialties</th>
            <th>Years of Experience</th>
            <th>Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate: Advocate, index) => {
            return (
              <tr key={`advocate.id_${index}`}>
                <td>{advocate.firstName}</td>
                <td>{advocate.lastName}</td>
                <td>{advocate.city}</td>
                <td>{advocate.degree}</td>
                <td>
                  {advocate.specialties.map((s: string, index: number) => (
                    <div key={`advocate.id_${index}`}>{s}</div>
                  ))}
                </td>
                <td>{advocate.yearsOfExperience}</td>
                <td>{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
