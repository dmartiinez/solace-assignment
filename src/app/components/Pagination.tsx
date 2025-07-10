"use client";
import Link from "next/link"

const Pagination = ({ search, page, totalPages }: { search: string; page: number, totalPages: number })  => {
    return (
        <div className="pagination-wrapper mt-[10px] mb-[10px] mr-[24px] text-right">
            <Link className={page <=1 ? 'pointer-events-none opacity-50' : ''} href={{
                pathname: '/',
                query: {
                  ...(search ? { search } : {}),
                  page: page > 1 ? page - 1 : 1
                }
            }}>
                Previous
            </Link>
            <span className="mx-3 underline">{`Page ${page} of ${totalPages}`}</span>
            <Link className={page >= totalPages ? 'pointer-events-none opacity-50' : ''} href={{
                pathname: '/',
                query: {
                  ...(search ? { search } : {}),
                  page: page + 1
                }
            }}>
                Next
            </Link>
        </div>
    );
}


export default Pagination