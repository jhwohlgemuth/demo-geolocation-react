import React, {useEffect, useState} from 'react';
import Cesium, {Cartesian3, Cartographic, Color} from 'cesium';
import {Camera, CameraFlyTo, Entity, Viewer} from 'resium';
import {geoToH3, h3ToGeoBoundary, h3IsValid} from 'h3-js';
const {fromDegrees} = Cartesian3;

Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxN2I2N2RkNi1iZjIyLTRjMTItOWU3NS01YTFhYzkxZmE2ZjgiLCJpZCI6MTUxMTYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1NjcxMjgyMzV9.nEwUTSZ5eViYDZpFGv0r_4y_feyu_rECyNS0uEtsSz4'; // eslint-disable-line max-len

function* range(max) {
    let index = 0;
    while (index < max) {
        yield index++;
    }
}

const Body = () => {
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const getBoundary = index => h3ToGeoBoundary(index)
        .map(([lat, lon]) => [lon, lat])
        .reduce((list, latLon) => [...list, ...latLon], []);
    const success = ({coords}) => {
        setLatitude(coords.latitude);
        setLongitude(coords.longitude);
        console.log('position', fromDegrees(longitude, latitude, 0));

    };
    const error = data => {
        console.log(data);
    };
    useEffect(() => {
        const options = {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        };
        const id = navigator.geolocation.watchPosition(success, error, options);
        return () => navigator.geolocation.clearWatch(id);
    }, []);
    return <Viewer
        style={{position: 'absolute', top: '60px', left: 0, right: 0, height: 'calc( 100% - 30px )'}}
        animation={false}
        homeButton={false}
        infoBox={false}
        navigationHelpButton={false}
        sceneMode={Cesium.SceneMode.SCENE2D}
        selectionIndicator={false}
        timeline={false}>
        <Camera />
        <Entity
            position={fromDegrees(longitude, latitude, 0)}
            point={{
                pixelSize: 30,
                color: Color.DEEPPINK
            }}/>
        {/* {h3IsValid(index) && <Entity
            description="H3 Hexagon"
            polygon={{hierarchy: fromDegreesArray(getBoundary(index)), material}}
        />} */}
        {/* <CameraFlyTo duration={5} destination={fromDegrees(longitude, latitude, 0)} /> */}
    </Viewer>;
};

export default Body;