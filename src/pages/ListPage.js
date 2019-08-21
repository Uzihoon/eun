import React from "react";
import PageTemplate from "components/common/PageTemplate";
import ListContainer from "components/containers/ListContainer";

const ListPage = () => {
  return (
    <PageTemplate nolayout={true}>
      <ListContainer />
    </PageTemplate>
  );
};

export default ListPage;
