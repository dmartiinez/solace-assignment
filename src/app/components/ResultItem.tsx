import { Advocate } from "@/types/advocate"

const ResultItem = ({ advocate }: { advocate: Advocate }) => {
    return (
        <div className="mb-5 border-b-4 pb-5">
            <h3 className="text-2xl mb-1">{advocate.firstName + " " + advocate.lastName + ", " + advocate.degree}</h3>
            <div className="info">
                <div className="info--details flex w-full mb-5">
                    <p className="mr-2"><span className="font-bold">City:</span> {advocate.city}</p>
                    <p><span className="font-bold">Years of Experience:</span> {advocate.yearsOfExperience}</p>
                </div>
                <p className="font-bold">Specialties:</p>
                <ul className="columns-3 gap-8 list-disc pl-6">
                    {advocate.specialties.map((specialty: string, index: number) => (
                        <li key={`${specialty}_${index}`} className="break-inside-avoid">{specialty}</li>
                    ))}
                </ul>
            </div>
            <a href={`tel:${advocate.phoneNumber}`} className="max-w-[300px] text-center block ml-auto mt-5 bg-green-800 hover:bg-green-600 text-white font-bold py-2 px-4 border border-blue-700 rounded">Make an appointmet today!</a>
        </div>
    )
}

export default ResultItem;