import React, { Suspense } from 'react'
import Layout from '@layouts/Layout'
import Login from '@pages/login/Login'
import { routes_here } from './routes'
import { Route, Routes } from 'react-router-dom'
import ScrollTop from '@components/ScrollTop'
import AdminLayout from '../layouts/AdminLayout'

export default function AppRoutes() {

    const isAuthenticated = true; // bool, based on token availabilty

    const renderRoute = (route, isAuthenticated) => {
        if (route.isPrivate || isAuthenticated) {
            return route.element;
        }
    };

    return (
        <Suspense fallback={<h1>Loading....</h1>}>
            <React.Fragment>

                <ScrollTop />
                <Routes>
                    {/* ================= All Routes ================ */}
                    {routes_here.map((route, key) => (
                        !isAuthenticated ?
                            <Route key={key} path="/login" element={<Login />} />
                            :
                            // <Route
                            //     // index
                            //     key={key}
                            //     path={route.path}
                            //     element={
                            //         <Layout>
                            //             <Suspense fallback={<h1>Loading....</h1>}>
                            //                 {renderRoute(route, isAuthenticated)}
                            //             </Suspense>
                            //         </Layout>
                            //     }
                            // />
                            <Route
                                // index
                                key={key}
                                path={route.path}
                                element={
                                    <AdminLayout>
                                        <Suspense fallback={<h1>Loading....</h1>}>
                                            {renderRoute(route, isAuthenticated)}
                                        </Suspense>
                                    </AdminLayout>
                                }
                            />
                    ))}
                </Routes>


            </React.Fragment>
        </Suspense>
    )
}
// <Route
//     // index
//     key={key}
//     path={route.path}
//     element={
//         <AdminLayout>
//             <Suspense fallback={<h1>Loading....</h1>}>
//                 {renderRoute(route, isAuthenticated)}
//             </Suspense>
//         </AdminLayout>
//     }
// />