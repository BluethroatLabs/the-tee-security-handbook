const sidebars = {
  docs: [
    // Overview
    { type: 'doc', id: 'index', label: 'Executive Summary' },
    { type: 'doc', id: 'what-to-expect' },
    { type: 'doc', id: 'backdrop-tees-and-adjacent-tech' },
    { type: 'doc', id: 'tees-in-web3' },

    // Platform Profiles
    {
      type: 'category',
      label: 'Platform Profiles and Architectures',
      link: { type: 'doc', id: 'platform-profiles-and-architectures' },
      collapsed: true,
      items: [
        { type: 'doc', id: 'Platforms/04A_aws-nitro-system', label: 'AWS Nitro System' },
        {
          type: 'category',
          label: 'AWS Nitro Enclaves',
          link: { type: 'doc', id: 'Platforms/04B_aws-nitro-enclaves' },
          collapsed: true,
          items: [
            { type: 'doc', id: 'Platforms/04C_aws-nitro-threat-vectors-paranoid', label: 'AWS Nitro Threat Vectors [PARANOID]' },
          ],
        },
        { type: 'doc', id: 'Platforms/04D_dstack-decentralized-cloud-tees', label: 'Dstack – Decentralized Cloud TEEs' },
      ],
    },

    // Security and Best Practices
    { type: 'doc', id: 'tee-attacks-categorisation' },
    { type: 'doc', id: 'dumb-ways-to-get-rekt-with-tees' },
    { type: 'doc', id: 'layers-of-security-for-tees' },

    // Closing
    { type: 'doc', id: 'future-directions' },
    { type: 'doc', id: 'contributors' },
  ],
};

module.exports = sidebars;