import si from 'systeminformation';
export const getSystemInfo = async () => {
  const info = await si.cpuCache();
  console.log('2323',info);
  
};

