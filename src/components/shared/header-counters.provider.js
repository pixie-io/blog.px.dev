import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

export const MenuCountersContext = React.createContext({});

export const MenuCountersProvider = ({ children }) => {
  const [totalUsers, setTotalUsers] = useState(0);
  const [totalGit, setTotalGit] = useState(0);


  const getSlackCounter = async () => {
    const stream = await fetch('https://slackin.withpixie.ai/data');
    const response = await stream.json();
    if (response) {
      setTotalUsers(response.total);
    }
  };
  const getGitCounter = async () => {
    const stream = await fetch('https://api.github.com/repos/pixie-labs/pixie');
    const response = await stream.json();
    if (response) {
      setTotalGit(response.watchers);
    }
  };

  useEffect(() => {
    (async function loadData() {
      getSlackCounter();
      getGitCounter();
    }());
  }, []);

  return (
    <MenuCountersContext.Provider value={{
      totalUsers,
      totalGit,
    }}
    >
      <div>{children}</div>
    </MenuCountersContext.Provider>
  );
};

MenuCountersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
