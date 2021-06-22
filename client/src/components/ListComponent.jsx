import axios from "axios";
import React, { useEffect, useState } from "react";

export default function ListComponent() {
  const [AllTransactios, setAllTransactios] = useState(null);
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
      const res = await axios.post("user/get-all-transaction", {
        user_id: localStorage.getItem("user_id"),
      });
      // console.log(res.data);
      setAllTransactios(res.data);
    })();

    return () => {
      if (
        localStorage.getItem("api_token") == null ||
        localStorage.getItem("api_token") == undefined
      ) {
        his.push("/login");
      }
      (async () => {
        const res = await axios.post("user/get-all-transaction", {
          user_id: localStorage.getItem("user_id"),
        });
        // console.log(res.data);
        setAllTransactios(res.data);
      })();
    };
  }, []);

  const resetData = () => {
    (async () => {
      const res = await axios.post("user/get-all-transaction", {
        user_id: localStorage.getItem("user_id"),
      });
      // console.log(res.data);
      setAllTransactios(res.data);
    })();
  };

  const filterData = (type) => {
    (async () => {
      const res = await axios.post("user/get-all-transaction", {
        user_id: localStorage.getItem("user_id"),
      });

      const newData = res.data.filter((list) => list.transactions_type == type);
      setAllTransactios(newData);
    })();
  };
  return (
    <div>
      <div className="my-6 w-full flex">
        <button
          onClick={() => {
            resetData();
          }}
          className="table_text_bg ml-4"
        >
          Refresh
        </button>
        <button
          onClick={() => {
            filterData("cash");
          }}
          className="table_text_bg ml-4"
        >
          cash
        </button>
        <button
          onClick={() => {
            filterData("bank");
          }}
          className="table_text_bg ml-4"
        >
          bank
        </button>
        <button
          onClick={() => {
            filterData("loan");
          }}
          className="table_text_bg ml-4"
        >
          loan
        </button>
      </div>
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="table_hade">
                      Type
                    </th>
                    <th scope="col" className="table_hade">
                      Action
                    </th>
                    <th scope="col" className="table_hade">
                      Amount
                    </th>
                    <th scope="col" className="table_hade">
                      Date
                    </th>
                    <th scope="col" className="table_hade">
                      Details
                    </th>
                    <th scope="col" className="table_hade">
                      Mode of transaction
                    </th>
                    <th scope="col" className="table_hade">
                      Loand Person
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {AllTransactios != null
                    ? AllTransactios.map((data) => (
                        <tr key={data.id}>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.transactions_type}
                            </span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.transactions_fun}
                            </span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">{data.amount}</span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.created_at}
                            </span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.transactions_detail}
                            </span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.mode_of_transaction}
                            </span>
                          </td>
                          <td className="table_data_bg">
                            <span className="table_text_bg">
                              {data.loand_person}
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
  );
}
