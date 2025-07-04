"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import "./globals.css"

export default function Home() {
  const [advocates, setAdvocates] = useState<Advocate[]>([]);
  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 400);

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

  useEffect(() => {
    const fetchAdvocates = async function() {
      try {
        console.log("fetching advocates...");
        const response = await fetch(`/api/advocates?search=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
          throw new Error("Request to fetch advocates failed.");
        }

        const jsonResponse = await response.json();
        setAdvocates(jsonResponse.data);
        setFilteredAdvocates(jsonResponse.data);
      } catch (error) {
        console.log("Failed to fetch advocates with error: " + error);
      } finally {
       setLoading(false);
      }
    }
    
    fetchAdvocates()
  }, [debouncedSearchTerm]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedTerm = e.target.value;
    setSearchTerm(searchedTerm);
  };

  const onClick = () => {
    setFilteredAdvocates(advocates);
    setSearchTerm("");
  };

  return (
    <main style={{ margin: "24px" }}>
      <h1 className="bg-green-800 py-4 px-4 text-white text-2xl">Solace Advocates</h1>
      <br />
      <br />
      {loading && (
        <div className="loading-screen">
          <button type="button" className="flex text-green-800 w-1/2 items-center justify-center" disabled>
            <svg className="mr-3 animate-spin -ml-1 mr-3 h-5 w-5 text-green-800" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Fetching Advocates
          </button>
        </div>
      )}
      {!loading &&(
        <>
          <div className="flex w-full">
            <label className= "hidden" htmlFor="search">Search</label>
            <input className="w-4/12 py-4 px-4" id="search" placeholder="Search For Advocates" style={{ border: "1px solid black" }} onChange={onChange} value={searchTerm} />
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-3" onClick={onClick}>Reset Search</button>
          </div>
          <br />
          <br />
          {filteredAdvocates.length == 0 && (
            <p className="text-center">No Advocates Found with that search term. Please try again.</p>
          )}
          {filteredAdvocates.length > 0 && (
            <table className="border-collapse border-2 border-gray-500 w-full">
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
          )}
        </>)}
    </main>
  );
}
