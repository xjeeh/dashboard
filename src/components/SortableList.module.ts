import styled from "styled-components";

const SortableList = styled.div`
  .helper {
    display: flex;
    flex-direction: row;
    padding: 5px 10px;
    align-items: center;
    cursor: default;
  }

  .helper .order,
  .helper .action {
    display: none;
  }
`;
