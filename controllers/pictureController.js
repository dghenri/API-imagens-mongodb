const Picture = require("../models/Picture");
const fs = require("node:fs/promises");

exports.create = async (req, res) => {
  try {
    const { name } = req.body

    const file = req.file

    const picture = new Picture({
      name,
      src: file.path,
    });

    await picture.save();

    res.json({ picture, msg: "Imagem salva com sucesso!" });

  } catch (error) {
    res.status(500).json({ message: "Erro ao salvar imagem." })
  }
};

exports.findAll = async (req, res) => {
  try {
    const pictures = await Picture.find();

    res.json(pictures);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar imagens." });
  }
};

exports.updatePhoto = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Envie uma imagem no campo 'file'." });
  }

  try {
    const picture = await Picture.findById(req.params.id);

    if (!picture) {
      await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ message: "Imagem não encontrada." });
    }

    const oldPath = picture.src;
    picture.src = req.file.path;
    await picture.save();

    await fs.unlink(oldPath).catch((error) => {
      if (error.code !== "ENOENT") {
        console.error("Não foi possível remover a foto antiga:", error);
      }
    });

    res.json({ picture, msg: "Foto atualizada com sucesso!" });
  } catch (error) {
    await fs.unlink(req.file.path).catch(() => {});
    res.status(500).json({ message: "Erro ao atualizar foto." });
  }
};

exports.remove = async (req, res) => {
  try {
    const picture = await Picture.findById(req.params.id);

    if (!picture) {
      return res.status(404).json({ message: "Imagem não encontrada." });
    }

    try {
      await fs.unlink(picture.src);
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }

    await picture.deleteOne();
    res.json({ picture, msg: "Imagem excluída com sucesso!" });
  } catch (error) {
    res.status(500).json({ message: "Erro ao excluir imagem." });
  }
}
