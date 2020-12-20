function mapErrors(map) {
  return (errors) => errors.map((error) => {
    if (map[error.type]) {
      return { message: map[error.type] };
    }

    return { message: error.message };
  });
}

module.exports = mapErrors;
