import React, { Component } from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Indel from "components/Indel";
import { withRouter } from "react-router";
import _ from "lodash";

class IndelContainer extends Component {
  constructor(props) {
    super(props);
    const { match } = props;
    const indelId = match.params.indelId;
    const cleavage = this.getCleavage(props.indel[indelId]);
    this.state = {
      chartType: "line",
      data: {
        datasets: []
      },
      indelId,
      options: {
        line: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            xAxes: [
              {
                type: "linear",
                ticks: {
                  authSkip: true,
                  stepSize: 1,
                  min: 1
                }
              }
            ],
            yAxes: [
              {
                ticks: {
                  beginAtZero: true
                }
              }
            ]
          },
          hover: {
            mode: "nearest",
            intersect: true
            // onHover: this.handleMouseOut
          },
          // animation: { duration: 0 },
          elements: {
            line: { tension: 0.2 },
            point: { radius: 0 }
          },
          tooltips: {
            mode: "index",
            intersect: false,
            callbacks: {
              label: this.handleHover
            }
          },
          annotation: {
            events: ["click"],
            annotations: [
              {
                type: "line",
                id: "vline" + 10,
                mode: "vertical",
                scaleID: "x-axis-0",
                value: cleavage,
                borderColor: "green",
                borderWidth: 2,
                label: {
                  enabled: true,
                  position: "top",
                  content: "Cleavage Site",
                  backgroundColor: "rgba(0,0,0,0)",
                  fontColor: "#242424"
                }
                // // drawTime: "afterDatasetsDraw",
                // id: "hline",
                // type: "line",
                // mode: "vertical",
                // scaleID: "y-axis-0",
                // value: 10,
                // borderColor: "black",
                // borderWidth: 1,
                // label: {
                //   backgroundColor: "red",
                //   content: "Test Label",
                //   enabled: true
                // },
                // onClick: function(e) {
                //   // The annotation is is bound to the `this` variable
                //   console.log("Annotation", e.type, this);
                // }
              }
            ]
          },
          plugins: {
            colorschemes: {
              scheme: "brewer.Paired12"
            },
            crosshair: {
              line: {
                color: "#F66", // crosshair line color
                width: 1 // crosshair line width
              },
              sync: {
                enabled: true, // enable trace line syncing with other charts
                group: 1, // chart group
                suppressTooltips: false // suppress tooltips when showing a synced tracer
              },
              zoom: {
                enabled: true, // enable zooming
                zoomboxBackgroundColor: "rgba(66,133,244,0.2)", // background color of zoom box
                zoomboxBorderColor: "#48F", // border color of zoom box
                zoomButtonText: "Reset Zoom", // reset zoom button text
                zoomButtonClass: "reset-zoom" // reset zoom button class
              },
              callbacks: {
                beforeZoom: function(start, end) {
                  // called before zoom, return false to prevent zoom
                  return true;
                },
                afterZoom: function(start, end) {
                  // called after zoom
                }
              }
            }
          }
        }
      },
      open: false,
      hoverIndex: null
    };
  }

  getCleavage = props => {
    if (!props) return 0;
    const { target_rna, seq_type, seq } = props;
    const pattern = new RegExp(target_rna);
    const target = pattern.exec(seq);
    const index = target ? target.index : 0;
    let cleavage = 0;
    switch (seq_type) {
      case 1:
        cleavage = index + target_rna.length - 2.5;
    }

    return cleavage;
  };

  handleMouseOut = e => {
    const type = e.type || "";
    if (type === "mouseout") {
      this.setState({ hoverIndex: null });
    }
  };

  handleOpen = _ => {
    const { open } = this.state;

    this.setState({ open: !open });
  };

  handleHover = (tooltipItem, data) => {
    const { hoverIndex } = this.state;
    const label = data.datasets[tooltipItem.datasetIndex].label || "";
    const xAxis = tooltipItem.xLabel;
    const value = +tooltipItem.value || 0.0;

    if (hoverIndex !== xAxis) {
      this.setState({ hoverIndex: xAxis });
    }
    return `${label}: ${+value.toFixed(2)}`;
  };

  componentWillMount() {
    const { indel, history } = this.props;
    const { indelId } = this.state;
    if (!indelId || !indel[indelId]) {
      history.push("/indel");
    }
  }

  componentDidMount() {
    const { indelId } = this.state;
    const { indel } = this.props;
    if (indel[indelId]) {
      this.handleDataset(indel[indelId]);
    }
  }

  handleImgDownload = _ => {
    const canvas = this.chart.chartInstance.canvas;
    const src = canvas.toDataURL("image/png");
    this.download(src, "[EUN]INDEL_Chart.png");
  };

  download = (href, fileName) => {
    const link = document.createElement("a");
    link.href = href;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  handleDataset = indelData => {
    const { chartType, options } = this.state;

    const datasets = indelData.result.map(data => ({
      backgroundColor: "transparent",
      data: data.indel,
      label: data.label,
      type: chartType,
      pointBorderWidth: 0,
      pointHitRadius: 0,
      pointBorderBackgroundColor: "transparent",
      pointBackgroundColor: "transparent"
    }));

    const chartOptions = _.cloneDeep(options);

    chartOptions[chartType].scales.xAxes[0].ticks.max = indelData.seq.length;

    this.setState({ data: { datasets }, options: chartOptions });
  };

  shouldComponentUpdate(nextProps, nextState) {
    const { indelId } = nextState;
    const { indel } = nextProps;
    const nextIndel = indel[indelId];
    const prevIndel = this.props.indel[indelId];
    if (nextIndel !== prevIndel && nextIndel) {
      this.handleDataset(nextIndel);
    }

    return true;
  }

  setRef = ref => {
    this.chart = ref;
  };

  render() {
    return <Indel {...this.props} {...this} {...this.state} />;
  }
}

export default withRouter(
  connect(
    state => ({
      indel: state.indel.get("indel").toJS()
    }),
    null
  )(IndelContainer)
);
