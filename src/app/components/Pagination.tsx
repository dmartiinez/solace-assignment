"use client";
import Link from "next/link"

const Pagination = ({ search, page, totalPages }: { search: string; page: number, totalPages: number })  => {
    return (
        <>
            <Link className={page <=1 ? 'pointer-events-none opacity-50' : ''} href={{
                pathname: '/',
                query: {
                  ...(search ? { search } : {}),
                  page: page > 1 ? page - 1 : 1
                }
            }}>
                Previous
            </Link>
            <Link className={page >= totalPages ? 'pointer-events-none opacity-50' : ''} href={{
                pathname: '/',
                query: {
                  ...(search ? { search } : {}),
                  page: page + 1
                }
            }}>
                Next
            </Link>
        </>
    );
}


export default Pagination