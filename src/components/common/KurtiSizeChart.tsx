'use client';

import { Table, Title } from '@mantine/core';

const KurtiSizeChart = () => {
  const sizes = [
    { measurement: 'CHEST', XS: 34, S: 36, M: 38, L: 40, XL: 42, '2XL': 44, '3XL': 46 },
    { measurement: 'WAIST', XS: 32, S: 33, M: 36, L: 38, XL: 40, '2XL': 42, '3XL': 44 },
    { measurement: 'HIP', XS: 37, S: 39, M: 42, L: 44, XL: 47, '2XL': 50, '3XL': 53 },
    { measurement: 'SHOULDER', XS: 12.5, S: 13, M: 13.5, L: 14, XL: 14.5, '2XL': 15, '3XL': 15.5 },
    { measurement: 'SLEEVE LENGTH', XS: 16, S: 16.5, M: 17, L: 17.5, XL: 17.5, '2XL': 18, '3XL': 18 },
    { measurement: 'LENGTH', XS: 46, S: 46, M: 46, L: 46, XL: 46, '2XL': 46, '3XL': 46 },
  ];

  const rows = sizes.map((size) => (
    <Table.Tr key={size.measurement} className="hover:bg-gray-50 transition-colors">
      <Table.Td className="font-semibold text-gray-800 border px-6 py-4 text-lg">
        {size.measurement}
      </Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size.XS}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size.S}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size.M}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size.L}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size.XL}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size['2XL']}</Table.Td>
      <Table.Td className="text-center border px-6 py-4 text-lg">{size['3XL']}</Table.Td>
    </Table.Tr>
  ));

  return (
    <div className="w-full max-w-5xl mx-auto px-4">
      {/* Professional Title outside the table box */}
      <Title
        order={3}
        className="text-xl md:text-2xl font-extrabold text-center text-gray-900 mb-8 tracking-wide"
      >
       Size Guide
      </Title>

      <div className="bg-white rounded-3xl shadow-xl overflow-x-auto p-8">
        <Table className="w-full border border-gray-300 text-base md:text-lg">
          <Table.Thead>
            <Table.Tr className="bg-gray-100">
              <Table.Th className="text-left font-semibold px-6 py-4 border border-gray-300">
                Measurement
              </Table.Th>
              {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'].map((size) => (
                <Table.Th
                  key={size}
                  className="text-center font-semibold px-6 py-4 border border-gray-300"
                >
                  {size}
                </Table.Th>
              ))}
            </Table.Tr>
          </Table.Thead>

          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </div>
    </div>
  );
};

export default KurtiSizeChart;
