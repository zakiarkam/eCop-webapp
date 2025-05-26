import { useState } from "react";
import { FaPencilAlt, FaTrash } from "react-icons/fa";

export default function CaseSection() {
  const [finesData, setFinesData] = useState([
    {
      id: 1,
      section: "21, 22, 23, 24, 2A",
      provision: "Identification Plates",
      fine: "1,000",
      points: 3,
    },
    {
      id: 2,
      section: "38",
      provision:
        "Revenue Licence to be displayed on motor vehicles and produced when required",
      fine: "1,000",
      points: 2,
    },
    {
      id: 3,
      section: "45",
      provision:
        "Prohibition on the use of motor vehicles in contravention of the provisions of revenue Licence",
      fine: "1,000",
      points: 3,
    },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(finesData.length / rowsPerPage);
  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const [newSection, setNewSection] = useState({
    section: "",
    provision: "",
    fine: "",
    points: "",
  });

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setNewSection((prev) => ({ ...prev, [name]: value }));
  };

  const addSection = () => {
    if (
      !newSection.section ||
      !newSection.provision ||
      !newSection.fine ||
      !newSection.points
    ) {
      alert("All fields are required!");
      return;
    }

    const newId = finesData.length ? finesData[finesData.length - 1].id + 1 : 1;
    setFinesData([
      ...finesData,
      {
        id: newId,
        section: newSection.section,
        provision: newSection.provision,
        fine: newSection.fine,
        points: Number(newSection.points),
      },
    ]);

    setNewSection({ section: "", provision: "", fine: "", points: "" });
  };

  const handleEdit = (index: number) => {
    console.log("Edit entry:", finesData[index]);
  };

  const handleDelete = (index: number) => {
    const updatedData = finesData.filter((_, i) => i !== index);
    setFinesData(updatedData);
  };

  return (
    <div className="container mx-auto px-4 py-3">
      <div className=" bg-white p-6 rounded-md shadow-md">
        <h2 className="text-xl font-bold mb-4">Add a New Section</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            name="section"
            value={newSection.section}
            onChange={handleInputChange}
            placeholder="Section of Act"
            className="border border-gray-300 rounded-md px-6 py-3 w-full"
          />
          <input
            type="text"
            name="provision"
            value={newSection.provision}
            onChange={handleInputChange}
            placeholder="Provision"
            className="border border-gray-300 rounded-md px-6 py-3 w-full"
          />
          <input
            type="text"
            name="fine"
            value={newSection.fine}
            onChange={handleInputChange}
            placeholder="Fine (Rs. C)"
            className="border border-gray-300 rounded-md px-6 py-3 w-full"
          />
          <input
            type="number"
            name="points"
            value={newSection.points}
            onChange={handleInputChange}
            placeholder="Points"
            className="border border-gray-300 rounded-md px-6 py-3 w-full"
          />
        </div>
        <button
          onClick={addSection}
          className="bg-[#6DB6FE] text-white px-6 py-2 mt-4 rounded-md hover:bg-blue-600"
        >
          Add Section
        </button>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-300 mt-6">
        <table className="w-full text-sm text-left text-gray-700 border-collapse">
          <thead className="bg-gray-100 text-gray-700">
            <tr className="bg-gray-100">
              <th className="px-6 py-3 border">ID</th>
              <th className="px-6 py-3 border">Section of Act</th>
              <th className="px-6 py-3 border">Provision</th>
              <th className="px-6 py-3 border">Fine (Rs.)</th>
              <th className="px-6 py-3 border">Points</th>
              <th className="px-6 py-3 border">Actions</th>
            </tr>
          </thead>
          <tbody>
            {finesData.map((fine) => (
              <tr key={fine.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 border text-center">{fine.id}</td>
                <td className="px-6 py-3 border">{fine.section}</td>
                <td className="px-6 py-3 border">{fine.provision}</td>
                <td className="px-6 py-3 border text-center">{fine.fine}.00</td>
                <td className="px-6 py-3 border text-center">{fine.points}</td>
                <td className="px-6 py-3 border text-center ">
                  <div className="flex space-x-2">
                    <button
                      className="text-[#6DB6FE] hover:opacity-30"
                      onClick={() => handleEdit(fine.id)}
                    >
                      <FaPencilAlt />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(fine.id)}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            <tr className="bg-gray-100">
              <td colSpan={7} className="px-6 py-3 text-center">
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <span className="text-sm">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
