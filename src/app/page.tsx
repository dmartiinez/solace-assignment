"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import "./globals.css"

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
      <h1 className="bg-green-800 py-4 px-4 text-white text-2xl">Solace Advocates</h1>
      <br />
      <br />
      <div className="flex w-full">
        <label className= "hidden" htmlFor="search">Search</label>
        <input className="w-4/12 py-4 px-4" id="search" placeholder="Search For Advocates" style={{ border: "1px solid black" }} onChange={onChange} />
        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-3" onClick={onClick}>Reset Search</button>
      </div>
      <br />
      <br />
      <table className="border-collapse border-2 border-gray-500">
        <thead>
          <tr>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">Advocate Name</th>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">City</th>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">Degree</th>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">Specialties</th>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">Years of Experience</th>
            <th className="border border-gray-400 px-4 py-2 text-gray-800">Phone Number</th>
          </tr>
        </thead>
        <tbody>
          {filteredAdvocates.map((advocate: Advocate, index) => {
            return (
              <tr key={`advocate.id_${index}`}>
                <td className="border border-gray-400 px-4 py-2 text-center">{advocate.firstName + " " + advocate.lastName}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{advocate.city}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{advocate.degree}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">
                  <p>{advocate.specialties.join(", ")}</p>
                </td>
                <td className="border border-gray-400 px-4 py-2 text-center">{advocate.yearsOfExperience}</td>
                <td className="border border-gray-400 px-4 py-2 text-center">{advocate.phoneNumber}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </main>
  );
}
