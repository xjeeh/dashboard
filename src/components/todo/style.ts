import styled from "styled-components";

const Wrapper = styled.div`
  width: 25%;
  padding: 10px;

  .tabs {
    display: flex;

    .tab {
      display: flex;
      margin-right: 10px;
      cursor: pointer;

      .name {
        transition: all 1s ease;
        max-width: 0px;
        overflow: hidden;
        font-weight: bold;
      }

      &:hover .name {
        max-width: 100px;
        margin: 0 5px 0 5px;
      }

      &.selected {
        border-bottom: solid 2px #8234b3;
      }
    }
  }

  .title {
    font-size: 1.5em;
    margin: 15px 10px 10px 10px;
  }

  .list {
    display: flex;
    flex-direction: column;

    .item {
      position: relative;
      display: flex;
      flex-direction: row;
      padding: 3px 10px;
      align-items: center;
      cursor: default;
      flex-basis: 100%;

      .order {
        flex: 0 0;
        padding: 2px 10px;
        flex-basis: 20px;
      }

      .description {
        display: flex;
        flex: 1 0;
        padding: 0 10px 0 10px;

        input {
          flex: 1 0 100%;
          font-size: 14px;
          padding: 5px 15px;
          box-sizing: border-box;
        }
      }

      &:hover .action {
        visibility: visible;
      }

      .action {
        visibility: hidden;
        position: absolute;
        display: flex;
        top: 10px;
        right: 0;
        flex: 0 0;
        padding: 0 10px;
        user-select: none;
      }
    }

    .new {
      display: flex;
      flex-direction: row;
      padding: 5px 10px;
      align-items: center;
      cursor: default;
      flex-basis: 100%;
      .description {
        display: flex;
        flex: 1 0;
        padding: 0 10px 0 10px;

        input {
          flex: 1 0 100%;
          font-size: 14px;
          padding: 5px 15px;
          box-sizing: border-box;
        }
      }
      .add {
        background: mediumseagreen;
        color: white;
        border: none;
        padding: 7px 20px;
      }
    }
  }
`;

export { Wrapper };
