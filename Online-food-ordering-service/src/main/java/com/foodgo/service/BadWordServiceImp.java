package com.foodgo.service;

import com.foodgo.model.BadWord;
import com.foodgo.repository.BadWordRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BadWordServiceImp implements BadWordService{
    @Autowired
    private BadWordRepository badWordRepository;
    @Override
    public boolean containsBadWords(String comment) {
        List<BadWord> badWords = badWordRepository.findAll();
        for (BadWord badWord : badWords) {
            if (comment.toLowerCase().contains(badWord.getWord().toLowerCase())) {
                return true;
            }
        }
        return false;
    }
}
