import React from 'react';
import Layout from '../components/layout/Layout';
import HoF from '../components/views/HoF';

export const HofPage = () => (
  <Layout
    title="The Chumbo | Hall of Fame"
    description="The 9 honoured men who are enshrined in the Chumbo Hall of Fame."
  >
    <HoF/>
  </Layout>
);

export default HofPage;
