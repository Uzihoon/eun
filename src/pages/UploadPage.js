import React from "react";
import PageTemplate from "components/common/PageTemplate";
import UploadContainer from "components/containers/UploadContainer";

const UploadPage = () => (
  <PageTemplate sampleBtn={true}>
    <UploadContainer />
  </PageTemplate>
);

export default UploadPage;
