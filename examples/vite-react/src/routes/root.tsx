import * as React from 'react';
import { Outlet } from 'react-router-dom';
import { Layout } from '../components/Layout';

export default function Root() {
  return (
    <Layout>
      <div id="detail">
        <Outlet />
      </div>
    </Layout>
  );
}
