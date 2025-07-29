'use client';
import React, { useEffect } from "react";
import { Button } from "@/components/Button";
import { SearchInput } from "@/components/Input";
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import type { TableProps } from 'antd';
import { Table } from 'antd';
import { ColumnsType, TableRowSelection } from 'antd/es/table/interface';
import { Patient } from "@/types/patient";
import { getAllPatients } from "@/services/PatientService";
import toast from 'react-hot-toast';

type Props = {
  children?: React.ReactNode
}

function PatientPage({ }: Props) {
  const [searchText, setSearchText] = React.useState<string>('');
  const [loadData, setLoadData] = React.useState<boolean>(false);
  const [allPatient, setAllPatient] = React.useState<Patient[]>();

  const rowSelectionDefault: TableRowSelection<Patient> = {
    type: 'radio',
    selectedRowKeys: [],
    onChange: (selectedRowKeys, selectedRows) => {
      console.log('selectedRowKeys changed: ', selectedRowKeys, selectedRows);
    }
  }

  const columns: ColumnsType<Patient> = [
    {
      title: "Nom et Prénom",
      dataIndex: 'fullname',
      key: 'fullname',
    },
    {
      title: "Date de Naissance",
      dataIndex: 'birthdate',
      key: 'birthdate',
      render: (date: string) => {
        return new Date(date).toLocaleDateString();
      }
    },
    {
      title: "Contact",
      dataIndex: 'contact',
      key: 'contact',
    },
    {
      title: "Email",
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: "Groupe Sanguin",
      dataIndex: 'bloodType',
      key: 'bloodType',
    },
    {
      title: "Adresse",
      dataIndex: 'address',
      key: 'address',
    },
  ];

  const tableColumns = columns.map((item) => ({ ...item }));

  const pagination: TableProps<Patient>['pagination'] = {
    position: ['none', 'bottomRight'],
    defaultPageSize: 10,
    pageSizeOptions: [20, 50, 100],
    showSizeChanger: true,
    total: allPatient?.length,
    showQuickJumper: true,
    showTotal: (total) => `Total ${total} patient(s)`
  }



  //   expandedRowRender,
  //   footer,
  //   rowSelection: {},
  //   scroll: undefined,
  //   tableLayout: undefined,

  const tableProps: TableProps<Patient> = {
    tableLayout: "fixed",
    loading: loadData,
    bordered: true,
    size: 'middle',
    showHeader: true,
    rowSelection: rowSelectionDefault,
    pagination: pagination,
    columns: tableColumns,
    dataSource: allPatient,
    scroll: {
      x: 'max-content'
    },
    title: () => {
      return <>
        <div className="flex flex-row justify-between items-center">
          <div className="w-2/4">
            <span className="text-base">La liste de tous les patients de votre clinique avec leurs coordonnées.</span>
          </div>
          <div className="flex flex-row w-2/4 gap-2 justify-end">

            <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
            {/* <SearchInput
              type="text"
              placeholder="Rechercher..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            /> */}
          </div>
        </div>
      </>
    },
  };

  useEffect(() => {
    setLoadData(true);
    getAllPatients().then((res) => {
      setAllPatient(res.data.data);
    }).catch((err) => {
      console.log(err.message);
      toast.error(err.message);
    }).finally(() => {
      setLoadData(false);
    })
  }, []);

  return (
    <div className="h-full shadow-lg border-0 p-2 m-2 bg-white">
      <div className="flex flex-wrap justify-between m-2 mb-2">
        {/* <span className="text-xl text-bold text-black inline-flex"></span> */}
        <span className="text-2xl font-extrabold">Patients</span>
        <Button className="bg-indigo-600 hover:bg-indigo-800" onClick={() => { }}>
          Ajouter Patient {" "}
          <LocalHospitalIcon fontSize="small" />
        </Button>
      </div>
      {/* Divider */}
      <hr className="md:min-w-full border-indigo-600 py-2 m-2" />
      <div className="flex flex-col m-2 mb-5">
        <Table {...tableProps} rowKey={(record) => record.patientId} />
      </div>
    </div>
  )
}

export default PatientPage