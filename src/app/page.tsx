"use client";

import { useEffect, useState } from "react";
import { Advocate } from "@/types/advocate";
import { useRouter, useSearchParams } from "next/navigation";
import "./globals.css"
import Pagination from "./components/Pagination";
import Loading from "./components/Loading";


export default function Home() {
  const router = useRouter();
  const params = useSearchParams();
  let rawPage = params.get('page')?.trim();
  rawPage = rawPage && !isNaN(Number(rawPage)) ? rawPage : "1";
  const currentPage: number = Number(rawPage)
  const resultsPerPage = 10;


  const [filteredAdvocates, setFilteredAdvocates] = useState<Advocate[]>([]);
  const [searchTerm, setSearchTerm] = useState(params.get('search') || '')
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(null);
  const [pageData, setPageData] = useState<{ start: number; end: number } | null>();
  
  useEffect(() => {
    console.log(rawPage)
  cleanUpParameters()
  const handler = setTimeout(() => {
    setDebouncedSearchTerm(searchTerm);
  }, 400);

  return () => {
    clearTimeout(handler);
  };
}, [searchTerm]);

  useEffect(() => {
    setLoading(true)
    const fetchAdvocates = async function() {
      try {
        console.log("fetching advocates...");
        const response = await fetch(`/api/advocates?search=${encodeURIComponent(searchTerm)}&page=${rawPage}`);

        if (!response.ok) {
          throw new Error("Request to fetch advocates failed.");
        }

        const jsonResponse = await response.json();
        setFilteredAdvocates(jsonResponse.data);
        setTotalPages(jsonResponse.totalPages);
        const total = jsonResponse.totalResults
        setTotalResults(total);

        setPageData({
          start: ((currentPage - 1) * resultsPerPage) + 1,
          end: (total - (currentPage * resultsPerPage)) < 0  ? total : currentPage * resultsPerPage
        })
        
      } catch (error) {
        console.log("Failed to fetch advocates with error: " + error);
      } finally {
       setLoading(false);
      }
    }
    
    fetchAdvocates()
  }, [debouncedSearchTerm, rawPage]);


  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchedTerm = e.target.value;
    setSearchTerm(searchedTerm);
    updateParameter({search: searchTerm});
  };

  const onClick = () => {
    setSearchTerm("");
  };

  const updateParameter = (updates: Record<string, any> ) => {
    const newParams = new URLSearchParams(params.toString());

    for(const key in updates) {
      if (updates[key] === undefined || updates[key] === '') {
        newParams.delete(key);
      } else {
        newParams.set(key, updates[key]);
      }
    }

    router.push(`?${newParams.toString()}`);
  };

  const cleanUpParameters = () => {
    const url = new URL(window.location.href);
    const page = url.searchParams.get("page");
    const search = url.searchParams.get("search");
    let modified = false

    if (page && isNaN(Number(page))) {
      url.searchParams.delete("page");
      modified = true;
    } 

    if (!search) {
      url.searchParams.delete("search");
      modified = true;
    } 
    if (modified) {
      window.history.replaceState(null, "", url.toString());
    }
  }

  return (
    <main style={{ margin: "24px" }}>
      <h2>Solace Advocates</h2>
      <p>{pageData && totalResults && `Results ${pageData?.start}-${pageData?.end} of ${totalResults}`}</p>
      <br />
      {loading && <Loading />}
      {!loading &&(
        <>
          <div className="flex w-full">
            <label className= "hidden" htmlFor="search">Search</label>
            <input className="w-4/12 py-4 px-4" id="search" placeholder="Search For Advocates" style={{ border: "1px solid black" }} onChange={onChange} value={searchTerm} />
            <button className="bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 border border-blue-700 rounded ml-3" onClick={onClick}>Reset Search</button>
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
          <Pagination search={searchTerm} page={currentPage} totalPages={totalPages} />
        </>
      )}
    </main>
  );
}
