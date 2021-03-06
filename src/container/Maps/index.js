import React, { Component, createRef } from "react";
import { QueryRenderer } from "react-relay";
import { fetchQuery } from "relay-runtime";
import { Map, TileLayer, Marker, Popup } from "react-leaflet";
import graphql from "babel-plugin-relay/macro";

import Modal from "@material-ui/core/Modal";

import RequestQueryContainer from "container/Request/RequestQueryContainer.js";
import FilterBar from "components/FilterBar";

import environment from "graphql/environment.js";

import L from "leaflet";

import ReactLeafletSearch from "react-leaflet-search";

const defaultZoom = 16;

const redIcon = new L.Icon({
  iconUrl: require(`assets/img/icons/POSITION.png`),
  shadowUrl: require(`assets/img/icons/SHADOW.png`),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const initialState = {
  open: false,
  company: null,
  categories: [],
  selectedCategories: [],
  searchName: null,
  position: [52.498588, 13.442352],
  bounds: {
    type: "Polygon",
    coordinates: [[[0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0], [0.0, 0.0]]],
  },
};

const gqlQuery = graphql`
  query MapsQuery($bounds: Geometry!) {
    allCompanies(location_Intersects: $bounds) {
      edges {
        node {
          id
          geometry {
            coordinates
          }
          properties {
            name
            description
            category {
              id
              slug
            }
          }
        }
      }
    }
  }
`;
const categoriesGqlQuery = graphql`
  query MapsCategoriesQuery {
    allCategories {
      edges {
        node {
          id
          slug
          name
        }
      }
    }
  }
`;

const lngLatToArray = (lngLat) => {
  return [lngLat.lng, lngLat.lat];
};

class Maps extends Component {
  constructor(props) {
    super(props);
    this.mapRef = createRef();
    this.state = initialState;
  }

  componentDidMount() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        ({ coords: { latitude, longitude } }) => {
          this.setState({ position: [latitude, longitude] });
        }
      );
    }
    this.updateBounds();

    fetchQuery(environment, categoriesGqlQuery).then(
      (
        { allCategories: { edges: categories } } = {
          allCategories: { edges: [] },
        }
      ) => {
        const sortedCategories = [...categories].sort((a, b) => {
          if (a.node.name > b.node.name) {
            return 1
          } else if (a.node.name < b.node.name) {
            return -1
          }
          return 0
        })
        this.setState({ categories: sortedCategories });
      }
    );
  }

  updateBounds = () => {
    if (this.mapRef && this.mapRef.current) {
      const bbox = this.mapRef.current.leafletElement.getBounds();
      const bounds = {
        type: "Polygon",
        coordinates: [
          [
            lngLatToArray(bbox.getSouthWest()),
            lngLatToArray(bbox.getNorthWest()),
            lngLatToArray(bbox.getNorthEast()),
            lngLatToArray(bbox.getSouthEast()),
            lngLatToArray(bbox.getSouthWest()),
          ],
        ],
      };
      this.setState({ bounds });
    }
  };

  handleOpenModal = () => {
    this.setState({ open: true });
  };

  handleCloseModal = () => {
    this.setState({ open: false });
  };

  handleCategoriesChange = (selectedCategories) => {
    this.setState({ selectedCategories });
  };

  setSearchName = (name) => {
    this.setState({ searchName: name });
  };

  filterCompanies = (edges) => {
    const { selectedCategories, searchName } = this.state;
    const edgesCategoryFiltered =
      selectedCategories.length > 0
        ? edges.filter(({ node: { properties: { category: { id } } } }) =>
            selectedCategories.includes(id)
          )
        : edges;
    const edgesNameFiltered = searchName
      ? edgesCategoryFiltered.filter(({ node: { id } }) => id === searchName.id)
      : edgesCategoryFiltered;
    return edgesNameFiltered;
  };

  renderMarkers = (edges) => {
    return this.filterCompanies(edges).map(
      ({
        node: {
          id,
          geometry: {
            coordinates: [lng, lat],
          },
          properties: {
            name,
            description,
            category: { slug },
          },
        },
      }) => {
        let icon = new L.Icon({
          iconUrl: require(`assets/img/icons/${slug}.png`),
          shadowUrl: require(`assets/img/icons/SHADOW.png`),
          iconSize: [66 * 0.75, 94 * 0.75],
          iconAnchor: [24, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });

        return (
          <Marker
            key={`${name}:${lat},${lng}`}
            position={[lat, lng]}
            icon={icon}
            onMouseOver={(e) => {
              e.target.openPopup();
            }}
            onMouseOut={(e) => {
              e.target.closePopup();
            }}
            onClick={() => {
              this.setState({ companyId: id }, this.handleOpenModal);
            }}
          >
            <Popup>
              <h3>{name}</h3>
              {description && <p>{description.substr(0, 50)}...</p>}
            </Popup>
          </Marker>
        );
      }
    );
  };

  renderMap = ({ allCompanies }  = { allCompanies: null } ) => {
    const companies = allCompanies ? allCompanies.edges : [];
    const { position, open, companyId, categories } = this.state;

    const markers = companies ? this.renderMarkers(companies) : [];

    const companyNames = companies
      ? companies.map(({ node: { id, properties: { name } } }) => ({
          id,
          name,
        }))
      : [];

    return (
      <>
        <FilterBar
          categories={categories}
          handleCategoriesChange={this.handleCategoriesChange}
          handleOnSearch={this.setSearchName}
          companyNames={companyNames}
        />
        <Map
          center={position}
          zoom={defaultZoom}
          maxZoom={16}
          attributionControl={true}
          zoomControl={true}
          doubleClickZoom={true}
          scrollWheelZoom={true}
          dragging={true}
          animate={true}
          easeLinearity={0.35}
          style={{ height: "100%" }}
          ref={this.mapRef}
          onViewportChanged={this.updateBounds}
        >
          <TileLayer url="https://{s}.tile.osm.org/{z}/{x}/{y}.png" />
          {markers}
          <ReactLeafletSearch
            position="topright"
            zoom={defaultZoom}
            search={position}
            inputPlaceholder="Straße, PLZ..."
            openSearchOnLoad={true}
            markerIcon={redIcon}
            showPopup={false}
            closeResultsOnClick={true}
            providerOptions={{
              se: [5.98865807458, 47.3024876979],
              nw: [15.0169958839, 54.983104153],
            }}
          />
        </Map>
        <Modal open={open} onClose={this.handleCloseModal}>
          <div
            style={{
              position: "absolute",
              maxWidth: "100%",
              width: "800px",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <RequestQueryContainer
              companyId={companyId}
              handleClose={this.handleCloseModal}
            />
          </div>
        </Modal>
      </>
    );
  };

  renderQueryResult = ({ error, props }) => {
    if (error) {
      console.log(error);
      // TODO: just display an error notification on top the map
      return <div>Error!</div>;
    }
    return props ? this.renderMap(props) : this.renderMap();
  };

  render() {
    const { bounds } = this.state;

    return (
      <QueryRenderer
        environment={environment}
        fetchPolicy="store-and-network"
        query={gqlQuery}
        variables={{ bounds: JSON.stringify(bounds) }}
        render={(resp) => this.renderQueryResult(resp)}
      />
    );
  }
}

export default Maps;
