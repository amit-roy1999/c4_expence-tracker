import axios from "axios";
import React, { useEffect, useState } from "react";

export default function AllLoandPerson() {
  const [AllLoandPersonList, setAllLoandPersonList] = useState();
  useEffect(() => {
    if (
      localStorage.getItem("api_token") == null ||
      (localStorage.getItem("api_token") == undefined &&
        localStorage.getItem("user_id") == null) ||
      localStorage.getItem("user_id") == undefined
    ) {
      his.push("/login");
    }
    // console.log(localStorage.getItem("user_id"));
    (async () => {
      const res = await axios.post("user/loand-persons-list", {
        user_id: localStorage.getItem("user_id"),
      });
      // console.log(res.data);
      setAllLoandPersonList(res.data);
    })();

    return () => {
      if (
        localStorage.getItem("api_token") == null ||
        localStorage.getItem("api_token") == undefined
      ) {
        his.push("/login");
      }
    };
  }, []);

  return (
    <div>
      <div>
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="table_hade">
                        Amount
                      </th>
                      <th scope="col" className="table_hade">
                        Loand Person
                      </th>
                      <th scope="col" className="table_hade">
                        First Date
                      </th>
                      <th scope="col" className="table_hade">
                        Last Uodated Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {AllLoandPersonList != null
                      ? AllLoandPersonList.map((data) => (
                          <tr key={data.id}>
                            <td className="table_data_bg">
                              <span className="table_text_bg">
                                {data.amount}
                              </span>
                            </td>
                            <td className="table_data_bg">
                              <span className="table_text_bg">
                                {data.loand_person}
                              </span>
                            </td>
                            <td className="table_data_bg">
                              <span className="table_text_bg">
                                {data.created_at}
                              </span>
                            </td>
                            <td className="table_data_bg">
                              <span className="table_text_bg">
                                {data.updated_at}
                              </span>
                            </td>
                          </tr>
                        ))
                      : null}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
