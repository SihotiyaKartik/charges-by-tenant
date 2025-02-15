import LandingPageCard from "./LandingPageCard"
import Heading from "./Heading"
import HorizontalLine from "./HorizontalLine"
import React, { useContext, useEffect, useState } from "react";
import { Store } from "../../../utility/Store";
import Cookies from "js-cookie";
import { useSnackbar } from "notistack";
import { useRouter } from "next/router";
import axios from "axios";

const TenantReq = () => {

    const { enqueueSnackbar, closeSnackbar } = useSnackbar();
    const { dispatch, state } = useContext(Store);
    useEffect(() => {
        getDetails();
    }, []);

    const getDetails = async () => {
        closeSnackbar();

        let config = {
            headers: {
                authorization: "b " + JSON.parse(Cookies.get("userInfo")).data.token,
            },
        };
        try {
            axios.post("/api/auth/users/login", {}, config).then((res) => {
                dispatch({
                    type: "USER_INFO_FETCHING",
                    payload: res.data?.data,
                });
            });
            enqueueSnackbar("Data Retrieved", { variant: "success" });
        } catch (err) {
            // console.log(err);
            enqueueSnackbar(err.response?.data?.message, { variant: "error" });
        }
    };

    useEffect(() => {
        ViewReq();
    }, []);

    const ViewReq = async () => {
        closeSnackbar();
        let config = {
            headers: {
                authorization: "b " + JSON.parse(Cookies.get("userInfo")).data.token,
            },
        };
        try {
            await axios.get("/api/profile/viewsite", config).then((res) => {
                dispatch({
                    type: "VIEW_REQUESTS",
                    payload: res.data,
                });
                console.log(res);
            });
        } catch (err) {
            // console.log(err);
            enqueueSnackbar(err.message, { variant: "error" });
        }
    };

    return (
        <>
            <Heading head="Your Requests" />
            <HorizontalLine />
            {state.siteDetail
                ? state.siteDetail?.map((data) => {
                    if (data.site_id?.status == "1") {
                        return (
                            <LandingPageCard
                                owner={data.site_id?.alias_name}
                                rent={data.rent}
                                address={`${data?.site_id?.address?.first_line}, ${data?.site_id?.address?.landmark}, ${data?.site_id?.address?.city}, ${data?.site_id?.address?.state}, ${data?.site_id?.address?.country} P.O: ${data?.site_id?.address?.pincode}`}
                                cclass="blue"
                                class1="btn-success"
                                text1="Accept"
                                class2="btn-danger px-2 S_request"
                                text2="Reject"
                            />
                        );
                    }
                })
                : "There are curently no requests."}
        </>
    )
}

export default TenantReq