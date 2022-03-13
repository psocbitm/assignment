import { useEffect, useState } from "react";
import "./App.css";
import axios from "axios";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/solid";
import { css } from "@emotion/react";
import ClipLoader from "react-spinners/ClipLoader";
/* This example requires Tailwind CSS v2.0+ */
import jsPDF from "jspdf";
import "jspdf-autotable";

function App() {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [results, setResults] = useState(50);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    async function fetchData() {
        const response = await axios.get(
            `https://randomuser.me/api/?page=${currentPage}&results=${results}`
        );
        setData(response.data.results);
        setLoading(false);
    }
    useEffect(() => {
        fetchData();
    }, [currentPage]);
    useEffect(() => {
        if (
            localStorage.getItem("color-theme") === "dark" ||
            (!("color-theme" in localStorage) &&
                window.matchMedia("(prefers-color-scheme: dark)").matches)
        ) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    }, []);
    const doc = new jsPDF();
    doc.autoTable({ html: "#table" });

    function Pagination() {
        function handleNextClick() {
            setLoading(true);
            currentPage !== 5 && setCurrentPage(currentPage + 1);
        }
        function handlePrevClick() {
            setLoading(true);
            currentPage !== 1 && setCurrentPage(currentPage - 1);
        }
        function handlePageClick(event) {
            setLoading(true);
            setCurrentPage(parseInt(event.target.innerHTML));
        }

        function downloadPDF() {
            doc.save("table.pdf");
        }

        return (
            <div className=" container mt-4 ">
                <div className="pb-4 flex justify-between items-center">
                    <nav
                        className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px bg-stone-50 dark:bg-stone-900"
                        aria-label="Pagination"
                    >
                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-stone-900 text-sm font-medium text-gray-500 dark:text-gray-50 hover:bg-gray-50"
                        >
                            <span className="sr-only">Previous</span>
                            <ChevronLeftIcon
                                className={`h-5 w-5`}
                                aria-hidden="true"
                                onClick={handlePrevClick}
                            />
                        </a>
                        {/* Current: "z-10 bg-indigo-50 border-indigo-500 text-indigo-600", Default: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50" */}

                        {Array(5)
                            .fill(1)
                            .map((item, index) => (
                                <a
                                    key={index}
                                    href="#"
                                    className={
                                        currentPage !== index + 1
                                            ? "relative inline-flex items-center px-4 py-2  text-sm font-medium text-gray-500 border dark:text-gray-50 dark:border-zinc-700"
                                            : "relative inline-flex items-center px-4 py-2   text-sm font-medium text-stone-800 border dark:text-gray-50  bg-stone-200 dark:bg-stone-800 z-10 border-stone-300"
                                    }
                                    onClick={handlePageClick}
                                >
                                    {index + 1}
                                </a>
                            ))}

                        <a
                            href="#"
                            className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-zinc-700 bg-white dark:bg-stone-900 text-sm font-medium text-gray-500 dark:text-gray-50 hover:bg-gray-50"
                        >
                            <span className="sr-only">Next</span>
                            <ChevronRightIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                                onClick={handleNextClick}
                            />
                        </a>
                    </nav>
                    <button
                        class="bg-transparent   dark:hover:bg-stone-50 dark:hover:text-stone-800 dark:text-stone-50 hover:bg-stone-800 text-stone-700 font-semibold hover:text-white py-2 px-4 border border-stone-500 hover:border-transparent rounded"
                        onClick={downloadPDF}
                    >
                        Download PDF
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="App min-h-screen bg-stone-200 dark:bg-stone-800 ">
            <div className="container mt-10">
                <div className="w-full">
                    <input
                        className="rounded w-full mt-4 p-2 outline-none bg-stone-50 dark:bg-stone-900 text-stone-800 dark:text-gray-50"
                        placeholder="Search by name, email, gender or age..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                        }}
                    />
                </div>

                <div className="flex justify-center mt-4">
                    {loading ? (
                        <div className="flex justify-center my-5">
                            <ClipLoader
                                color=" rgb(113 113 122)"
                                loading={loading}
                                size={50}
                            />
                        </div>
                    ) : (
                        <table
                            id="table"
                            className="text-white bg-stone-100 dark:bg-stone-900 text-stone-900 dark:text-stone-100  table-fixed rounded-lg  w-full shadow-md"
                        >
                            <thead className="">
                                <tr className="">
                                    <th className="text-left py-2 px-3">
                                        Name
                                    </th>
                                    <th className="text-left py-2 px-3">
                                        Gender
                                    </th>
                                    <th className="text-left py-2 px-3">Age</th>
                                    <th className="text-left py-2 px-3">
                                        Email
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {data
                                    .filter(
                                        (item) =>
                                            item.name.first
                                                .toUpperCase()
                                                .includes(
                                                    search.toUpperCase()
                                                ) ||
                                            item.name.last
                                                .toUpperCase()
                                                .includes(
                                                    search.toUpperCase()
                                                ) ||
                                            item.email
                                                .toUpperCase()
                                                .includes(
                                                    search.toUpperCase()
                                                ) ||
                                            item.gender
                                                .toUpperCase()
                                                .includes(
                                                    search.toUpperCase()
                                                ) ||
                                            item.dob.age == search
                                    )
                                    .map((item, index) => (
                                        <tr
                                            className="table-row border-t dark:border-slate-400 hover:dark:bg-zinc-800 hover:bg-slate-300 cursor-pointer "
                                            key={index}
                                        >
                                            <td className="py-2 px-3">
                                                {item.name.first}{" "}
                                                {item.name.last}
                                            </td>
                                            <td className="py-2 px-3 capitalize">
                                                {item.gender}
                                            </td>
                                            <td className="py-2 px-3">
                                                {item.dob.age}
                                            </td>
                                            <td className="py-2 px-3">
                                                {item.email}
                                            </td>
                                        </tr>
                                    ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
            <Pagination />
        </div>
    );
}

export default App;
